from fastapi import status
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models.memory import Memory
from app.models.user import User
from app.models.user_goal import UserGoal
from app.models.user_profile import UserProfile
from app.schemas.onboarding import OnboardingCompleteRequest


def complete_onboarding(
    user: User, db: Session, payload: OnboardingCompleteRequest
) -> UserProfile:
    if payload.companion_mode == "romantic_partner" and not payload.age_confirmed:
        raise AppError(
            "Romantic Partner mode requires 18+ confirmation",
            status.HTTP_400_BAD_REQUEST,
        )

    user.gender = payload.gender
    user.age_confirmed = payload.age_confirmed
    user.onboarding_completed = True

    profile = user.profile or UserProfile(user_id=user.id)
    profile.companion_name = payload.companion_name
    profile.companion_gender = payload.companion_gender
    profile.companion_mode = payload.companion_mode
    profile.companion_tone = payload.companion_tone
    profile.user_support_preference = payload.user_support_preference
    profile.emotional_boundaries = payload.emotional_boundaries

    db.add(user)
    db.add(profile)

    if payload.initial_goal_text:
        db.add(UserGoal(user_id=user.id, goal_text=payload.initial_goal_text.strip()))
        db.add(
            Memory(
                user_id=user.id,
                memory_text=payload.initial_goal_text.strip(),
                memory_type="goal",
                importance_score=6,
            )
        )

    if payload.initial_memory_text:
        db.add(
            Memory(
                user_id=user.id,
                memory_text=payload.initial_memory_text.strip(),
                memory_type="personal_fact",
                importance_score=7,
            )
        )

    db.commit()
    db.refresh(user)
    db.refresh(profile)
    return profile
