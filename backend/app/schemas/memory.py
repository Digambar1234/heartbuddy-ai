from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

MemoryType = Literal[
    "personal_fact",
    "emotional_event",
    "goal",
    "fear",
    "preference",
    "relationship_context",
    "achievement",
    "negative_pattern",
    "positive_pattern",
    "trigger",
    "coping_strategy",
]


class MemoryRead(BaseModel):
    id: UUID
    user_id: UUID
    memory_text: str
    memory_type: MemoryType
    emotion: str | None
    importance_score: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_used_at: datetime | None

    model_config = {"from_attributes": True}


class MemoryCreate(BaseModel):
    memory_text: str = Field(min_length=1, max_length=3000)
    memory_type: MemoryType
    emotion: str | None = Field(default=None, max_length=80)
    importance_score: int = Field(ge=1, le=10)


class MemoryUpdate(BaseModel):
    memory_text: str = Field(min_length=1, max_length=3000)
    memory_type: MemoryType
    emotion: str | None = Field(default=None, max_length=80)
    importance_score: int = Field(ge=1, le=10)
    is_active: bool


class DeleteAllConfirmation(BaseModel):
    confirm: bool = False


class MemoryExport(BaseModel):
    exported_at: datetime
    user_id: UUID
    memories: list[MemoryRead]
