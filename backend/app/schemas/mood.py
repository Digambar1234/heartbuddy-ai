from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

MoodValue = Literal[
    "happy",
    "proud",
    "calm",
    "sad",
    "lonely",
    "anxious",
    "angry",
    "heartbroken",
    "demotivated",
    "stressed",
    "confused",
    "neutral",
]


class MoodLogCreate(BaseModel):
    mood: MoodValue
    intensity: int = Field(ge=1, le=10)
    reason: str | None = Field(default=None, max_length=2000)


class MoodLogRead(BaseModel):
    id: UUID
    user_id: UUID
    mood: MoodValue
    intensity: int
    reason: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class MoodDailySummary(BaseModel):
    date: date
    average_intensity: float
    dominant_mood: str


class MoodSummary(BaseModel):
    total_logs: int
    most_common_mood: str | None
    average_intensity: float | None
    recent_mood: str | None
    recent_intensity: int | None
    common_triggers: list[str]
    last_7_days: list[MoodDailySummary]
