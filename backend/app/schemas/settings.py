from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

CompanionGender = Literal["female", "male", "neutral"]
CompanionMode = Literal["friend", "romantic_partner", "coach", "listener"]
CompanionTone = Literal["soft", "playful", "mature", "motivational", "calm", "strict_supportive"]


class ProfileRead(BaseModel):
    id: UUID
    user_id: UUID
    companion_name: str
    companion_gender: CompanionGender
    companion_mode: CompanionMode
    companion_tone: CompanionTone
    user_support_preference: str | None
    emotional_boundaries: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    companion_name: str = Field(default="HeartBuddy", min_length=1, max_length=120)
    companion_gender: CompanionGender = "neutral"
    companion_mode: CompanionMode = "friend"
    companion_tone: CompanionTone = "soft"
    user_support_preference: str | None = Field(default=None, max_length=2000)
    emotional_boundaries: str | None = Field(default=None, max_length=2000)
