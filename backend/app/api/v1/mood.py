from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.mood_log import MoodLog
from app.models.user import User
from app.schemas.mood import MoodLogCreate, MoodLogRead, MoodSummary
from app.services.mood_service import create_mood_log, delete_mood_log, get_mood_summary, list_mood_logs

router = APIRouter()


@router.post("", response_model=MoodLogRead)
def create_mood(
    payload: MoodLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MoodLog:
    return create_mood_log(db, current_user.id, payload)


@router.get("", response_model=list[MoodLogRead])
def get_mood_logs(
    limit: int = Query(default=30, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    mood: str | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MoodLog]:
    return list_mood_logs(db, current_user.id, limit, offset, mood, date_from, date_to)


@router.get("/summary", response_model=MoodSummary)
def mood_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MoodSummary:
    return get_mood_summary(db, current_user.id)


@router.delete("/{mood_log_id}")
def delete_mood(
    mood_log_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, bool]:
    delete_mood_log(db, current_user.id, mood_log_id)
    return {"deleted": True}
