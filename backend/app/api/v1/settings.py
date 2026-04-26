from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.settings import ProfileRead, ProfileUpdate
from app.services.profile_service import ensure_profile, update_profile

router = APIRouter()


@router.get("/profile", response_model=ProfileRead)
def get_profile(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> ProfileRead:
    return ensure_profile(current_user, db)


@router.put("/profile", response_model=ProfileRead)
def put_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProfileRead:
    return update_profile(current_user, db, payload)
