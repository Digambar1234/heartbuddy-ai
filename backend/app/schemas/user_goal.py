from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class UserGoalCreate(BaseModel):
    goal_text: str = Field(min_length=1, max_length=2000)
    goal_category: str | None = Field(default=None, max_length=80)


class UserGoalRead(BaseModel):
    id: UUID
    user_id: UUID
    goal_text: str
    goal_category: str | None
    status: Literal["active", "completed", "paused"]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
