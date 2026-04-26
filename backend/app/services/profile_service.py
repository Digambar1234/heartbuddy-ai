from fastapi import status
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models.user import User
from app.models.user_profile import UserProfile
from app.schemas.settings import ProfileUpdate


def ensure_profile(user: User, db: Session) -> UserProfile:
    if user.profile:
        return user.profile

    profile = UserProfile(user_id=user.id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_profile(user: User, db: Session, payload: ProfileUpdate) -> UserProfile:
    if payload.companion_mode == "romantic_partner" and not user.age_confirmed:
        raise AppError(
            "Romantic Partner mode requires 18+ confirmation",
            status.HTTP_400_BAD_REQUEST,
        )

    profile = ensure_profile(user, db)
    for field, value in payload.model_dump().items():
        setattr(profile, field, value)

    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
