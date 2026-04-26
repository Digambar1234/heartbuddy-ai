from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel

Sender = Literal["user", "assistant", "system"]
RiskLevel = Literal["normal", "sensitive", "crisis"]


class MessageRead(BaseModel):
    id: UUID
    conversation_id: UUID
    sender: Sender
    content: str
    emotion_detected: str | None
    risk_level: RiskLevel
    memories_used_count: int
    created_at: datetime

    model_config = {"from_attributes": True}
