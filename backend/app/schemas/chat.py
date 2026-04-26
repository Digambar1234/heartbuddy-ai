from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.conversation import ConversationRead
from app.schemas.memory import MemoryRead
from app.schemas.message import MessageRead, RiskLevel


class ChatMessageRequest(BaseModel):
    message: str = Field(min_length=1, max_length=5000)
    conversation_id: UUID | None = None


class ChatResponse(BaseModel):
    conversation_id: UUID
    user_message_id: UUID
    assistant_message_id: UUID
    assistant_message: str
    emotion_detected: str
    risk_level: RiskLevel
    memories_used: list[MemoryRead]
    new_memories_saved: list[MemoryRead]
    used_fallback_response: bool


class ConversationDetailResponse(ConversationRead):
    messages: list[MessageRead]
