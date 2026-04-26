import uuid
from datetime import UTC, datetime

from fastapi import status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.core.exceptions import AppError
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.safety_event import SafetyEvent
from app.models.user import User
from app.schemas.chat import ChatResponse
from app.services.emotion_service import detect_emotion
from app.services.llm_service import generate_response
from app.services.memory_extractor import extract_memories_from_message, extract_memories_with_llm
from app.services.memory_service import mark_memories_used, retrieve_relevant_memories, save_memory
from app.services.profile_service import ensure_profile
from app.services.prompt_builder import build_companion_prompt
from app.services.safety_service import analyze_safety, crisis_response


def create_conversation(db: Session, user: User, title: str | None = None) -> Conversation:
    conversation = Conversation(user_id=user.id, title=title or "New conversation")
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


def list_conversations(db: Session, user: User) -> list[Conversation]:
    return list(
        db.scalars(
            select(Conversation)
            .where(Conversation.user_id == user.id)
            .order_by(Conversation.updated_at.desc())
        )
    )


def get_conversation_for_user(db: Session, user: User, conversation_id: uuid.UUID) -> Conversation:
    conversation = db.scalar(
        select(Conversation)
        .options(selectinload(Conversation.messages))
        .where(Conversation.id == conversation_id, Conversation.user_id == user.id)
    )
    if conversation is None:
        raise AppError("Conversation not found", status.HTTP_404_NOT_FOUND)
    return conversation


def handle_user_message(
    db: Session,
    user: User,
    message: str,
    conversation_id: uuid.UUID | None = None,
) -> ChatResponse:
    if not user.onboarding_completed:
        raise AppError("Onboarding not completed", status.HTTP_400_BAD_REQUEST)

    conversation = (
        get_conversation_for_user(db, user, conversation_id)
        if conversation_id
        else Conversation(user_id=user.id, title=_conversation_title(message))
    )
    if not conversation_id:
        db.add(conversation)
        db.flush()

    safety = analyze_safety(message)
    emotion = detect_emotion(message)

    user_message = Message(
        conversation_id=conversation.id,
        user_id=user.id,
        sender="user",
        content=message.strip(),
        emotion_detected=emotion,
        risk_level=safety.risk_level,
    )
    db.add(user_message)
    db.flush()

    if safety.should_use_crisis_response:
        assistant_text = crisis_response()
        assistant_message = Message(
            conversation_id=conversation.id,
            user_id=user.id,
            sender="assistant",
            content=assistant_text,
            emotion_detected=emotion,
            risk_level="crisis",
        )
        db.add(assistant_message)
        db.add(
            SafetyEvent(
                user_id=user.id,
                message_id=user_message.id,
                risk_level="crisis",
                detected_reason=safety.detected_reason,
                action_taken="crisis_response_returned",
            )
        )
        conversation.updated_at = datetime.now(UTC)
        db.add(conversation)
        db.commit()
        db.refresh(user_message)
        db.refresh(assistant_message)
        return ChatResponse(
            conversation_id=conversation.id,
            user_message_id=user_message.id,
            assistant_message_id=assistant_message.id,
            assistant_message=assistant_text,
            emotion_detected=emotion,
            risk_level="crisis",
            memories_used=[],
            new_memories_saved=[],
            used_fallback_response=False,
        )

    profile = ensure_profile(user, db)
    relevant_memories = retrieve_relevant_memories(db, user.id, message, emotion, limit=5)
    recent_messages = list(
        db.scalars(
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.created_at.desc())
            .limit(10)
        )
    )
    recent_messages.reverse()

    prompt = build_companion_prompt(
        user=user,
        profile=profile,
        recent_messages=recent_messages,
        relevant_memories=relevant_memories,
        current_message=message,
        emotion=emotion,
        risk_level=safety.risk_level,
    )
    llm_response = generate_response(prompt)

    assistant_message = Message(
        conversation_id=conversation.id,
        user_id=user.id,
        sender="assistant",
        content=llm_response.text,
        emotion_detected=emotion,
        risk_level=safety.risk_level,
        memories_used_count=len(relevant_memories),
    )
    db.add(assistant_message)
    db.flush()

    extracted = (
        extract_memories_with_llm(message, emotion)
        if settings.ENABLE_LLM_MEMORY_EXTRACTION and settings.OPENAI_API_KEY
        else extract_memories_from_message(message, emotion)
    )
    saved_memories = [
        save_memory(
            db=db,
            user_id=user.id,
            memory_text=item.memory_text,
            memory_type=item.memory_type,
            emotion=item.emotion,
            importance_score=item.importance_score,
            source_message_id=user_message.id,
        )
        for item in extracted
    ]

    mark_memories_used(db, [memory.id for memory in relevant_memories])
    conversation.updated_at = datetime.now(UTC)
    db.add(conversation)
    db.commit()

    for instance in [user_message, assistant_message, *relevant_memories, *saved_memories]:
        db.refresh(instance)

    return ChatResponse(
        conversation_id=conversation.id,
        user_message_id=user_message.id,
        assistant_message_id=assistant_message.id,
        assistant_message=llm_response.text,
        emotion_detected=emotion,
        risk_level=safety.risk_level,
        memories_used=relevant_memories,
        new_memories_saved=saved_memories,
        used_fallback_response=llm_response.used_fallback_response,
    )


def _conversation_title(message: str) -> str:
    cleaned = " ".join(message.strip().split())
    return cleaned[:60] if cleaned else "New conversation"
