import re
import uuid
from datetime import UTC, datetime, timedelta

from fastapi import status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models.memory import Memory

MOTIVATION_WORDS = {"motivation", "career", "job", "interview", "failure", "failed", "focus", "study", "work"}
STOP_WORDS = {"the", "and", "you", "are", "for", "with", "that", "this", "feel", "today", "again", "myself"}


def retrieve_relevant_memories(
    db: Session,
    user_id: uuid.UUID,
    message: str,
    emotion: str,
    limit: int = 5,
) -> list[Memory]:
    memories = list(
        db.scalars(
            select(Memory)
            .where(Memory.user_id == user_id, Memory.is_active.is_(True))
            .order_by(Memory.created_at.desc())
            .limit(80)
        )
    )
    scored = [(memory, _score_memory(memory, message, emotion)) for memory in memories]
    scored = [(memory, score) for memory, score in scored if score > 0]
    scored.sort(key=lambda item: item[1], reverse=True)
    return [memory for memory, _ in scored[: max(3, min(limit, 7))]]


def save_memory(
    db: Session,
    user_id: uuid.UUID,
    memory_text: str,
    memory_type: str,
    emotion: str | None,
    importance_score: int,
    source_message_id: uuid.UUID | None = None,
) -> Memory:
    memory = Memory(
        user_id=user_id,
        source_message_id=source_message_id,
        memory_text=memory_text.strip(),
        memory_type=memory_type,
        emotion=emotion,
        importance_score=importance_score,
    )
    db.add(memory)
    db.flush()
    db.refresh(memory)
    return memory


def list_user_memories(
    db: Session,
    user_id: uuid.UUID,
    memory_type: str | None = None,
    emotion: str | None = None,
    active_only: bool = True,
    search: str | None = None,
    limit: int = 100,
    offset: int = 0,
) -> list[Memory]:
    query = select(Memory).where(Memory.user_id == user_id)
    if active_only:
        query = query.where(Memory.is_active.is_(True))
    if memory_type:
        query = query.where(Memory.memory_type == memory_type)
    if emotion:
        query = query.where(Memory.emotion == emotion)
    if search:
        query = query.where(Memory.memory_text.ilike(f"%{search}%"))
    return list(
        db.scalars(
            query.order_by(Memory.created_at.desc()).limit(min(limit, 200)).offset(max(offset, 0))
        )
    )


def get_user_memory(db: Session, user_id: uuid.UUID, memory_id: uuid.UUID) -> Memory:
    memory = db.scalar(select(Memory).where(Memory.id == memory_id, Memory.user_id == user_id))
    if memory is None:
        raise AppError("Memory not found", status.HTTP_404_NOT_FOUND)
    return memory


def update_user_memory(db: Session, user_id: uuid.UUID, memory_id: uuid.UUID, payload) -> Memory:
    memory = get_user_memory(db, user_id, memory_id)
    for field, value in payload.model_dump().items():
        setattr(memory, field, value)
    db.add(memory)
    db.commit()
    db.refresh(memory)
    return memory


def set_memory_active(db: Session, user_id: uuid.UUID, memory_id: uuid.UUID, is_active: bool) -> Memory:
    memory = get_user_memory(db, user_id, memory_id)
    memory.is_active = is_active
    db.add(memory)
    db.commit()
    db.refresh(memory)
    return memory


def delete_user_memory(db: Session, user_id: uuid.UUID, memory_id: uuid.UUID) -> None:
    memory = get_user_memory(db, user_id, memory_id)
    db.delete(memory)
    db.commit()


def delete_all_user_memories(db: Session, user_id: uuid.UUID) -> int:
    result = db.execute(delete(Memory).where(Memory.user_id == user_id))
    db.commit()
    return int(result.rowcount or 0)


def mark_memories_used(db: Session, memory_ids: list[uuid.UUID]) -> None:
    if not memory_ids:
        return
    now = datetime.now(UTC)
    for memory in db.scalars(select(Memory).where(Memory.id.in_(memory_ids))):
        memory.last_used_at = now
        db.add(memory)


def _score_memory(memory: Memory, message: str, emotion: str) -> int:
    score = memory.importance_score
    message_keywords = _keywords(message)
    memory_keywords = _keywords(memory.memory_text)

    if memory.emotion and memory.emotion == emotion:
        score += 5
    if memory.memory_type == "goal" and message_keywords.intersection(MOTIVATION_WORDS):
        score += 3
    if message_keywords.intersection(memory_keywords):
        score += 3
    if memory.created_at and memory.created_at > datetime.now(UTC) - timedelta(days=14):
        score += 2
    if memory.last_used_at and memory.last_used_at > datetime.now(UTC) - timedelta(hours=6):
        score -= 1
    return score


def _keywords(text: str) -> set[str]:
    return {word for word in re.findall(r"[a-zA-Z']{4,}", text.lower()) if word not in STOP_WORDS}
