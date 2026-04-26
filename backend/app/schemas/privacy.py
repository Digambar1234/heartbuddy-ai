from datetime import datetime
from typing import Any

from pydantic import BaseModel


class ConfirmRequest(BaseModel):
    confirm: bool = False


class DeleteResult(BaseModel):
    deleted_count: int


class PrivacyExport(BaseModel):
    exported_at: datetime
    user: dict[str, Any]
    profile: dict[str, Any] | None
    memories: list[dict[str, Any]]
    mood_logs: list[dict[str, Any]]
    goals: list[dict[str, Any]]
    conversations: list[dict[str, Any]]
