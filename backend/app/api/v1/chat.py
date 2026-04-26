from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.conversation import Conversation
from app.models.user import User
from app.schemas.chat import ChatMessageRequest, ChatResponse, ConversationDetailResponse
from app.schemas.conversation import ConversationCreate, ConversationRead
from app.services.companion_service import (
    create_conversation,
    get_conversation_for_user,
    handle_user_message,
    list_conversations,
)

router = APIRouter()


@router.post("/conversations", response_model=ConversationRead)
def post_conversation(
    payload: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Conversation:
    return create_conversation(db, current_user, payload.title)


@router.get("/conversations", response_model=list[ConversationRead])
def get_conversations(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> list[Conversation]:
    return list_conversations(db, current_user)


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Conversation:
    conversation = get_conversation_for_user(db, current_user, conversation_id)
    conversation.messages = [message for message in conversation.messages if message.user_id == current_user.id]
    return conversation


@router.post("/message", response_model=ChatResponse)
def post_message(
    payload: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChatResponse:
    return handle_user_message(db, current_user, payload.message, payload.conversation_id)
