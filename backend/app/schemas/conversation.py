from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.message import MessageRead


class ConversationCreate(BaseModel):
    title: str | None = Field(default=None, max_length=160)


class ConversationRead(BaseModel):
    id: UUID
    title: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ConversationWithMessages(ConversationRead):
    messages: list[MessageRead]
