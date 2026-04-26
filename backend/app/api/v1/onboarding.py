from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.onboarding import (
    OnboardingCompleteRequest,
    OnboardingCompleteResponse,
    OnboardingStatus,
)
from app.services.onboarding_service import complete_onboarding

router = APIRouter()


@router.get("/status", response_model=OnboardingStatus)
def status(current_user: User = Depends(get_current_user)) -> OnboardingStatus:
    return OnboardingStatus(
        onboarding_completed=current_user.onboarding_completed,
        has_profile=current_user.profile is not None,
    )


@router.post("/complete", response_model=OnboardingCompleteResponse)
def complete(
    payload: OnboardingCompleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OnboardingCompleteResponse:
    profile = complete_onboarding(current_user, db, payload)
    return OnboardingCompleteResponse(user=current_user, profile=profile)
