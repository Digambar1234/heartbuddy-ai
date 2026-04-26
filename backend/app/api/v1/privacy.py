from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.exceptions import AppError
from app.models.user import User
from app.schemas.privacy import ConfirmRequest, DeleteResult, PrivacyExport
from app.services.memory_service import delete_all_user_memories
from app.services.mood_service import delete_all_mood_logs
from app.services.privacy_service import export_user_data

router = APIRouter()


@router.get("/export-data", response_model=PrivacyExport)
def export_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    return export_user_data(db, current_user)


@router.post("/delete-memories", response_model=DeleteResult)
def delete_memories(
    payload: ConfirmRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DeleteResult:
    if not payload.confirm:
        raise AppError("Confirmation required")
    return DeleteResult(deleted_count=delete_all_user_memories(db, current_user.id))


@router.post("/delete-mood-logs", response_model=DeleteResult)
def delete_mood_logs(
    payload: ConfirmRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DeleteResult:
    if not payload.confirm:
        raise AppError("Confirmation required")
    return DeleteResult(deleted_count=delete_all_mood_logs(db, current_user.id))
