from dataclasses import dataclass
from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel

RiskLevel = Literal["normal", "sensitive", "crisis"]


@dataclass(frozen=True)
class SafetyAnalysis:
    risk_level: RiskLevel
    detected_reason: str
    should_use_crisis_response: bool


class SafetyEventRead(BaseModel):
    id: UUID
    user_id: UUID
    message_id: UUID | None
    risk_level: RiskLevel
    detected_reason: str | None
    action_taken: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
