from pydantic import BaseModel, Field

from app.schemas.settings import CompanionGender, CompanionMode, CompanionTone, ProfileRead
from app.schemas.user import UserRead


class OnboardingStatus(BaseModel):
    onboarding_completed: bool
    has_profile: bool


class OnboardingCompleteRequest(BaseModel):
    gender: str | None = Field(default=None, max_length=50)
    age_confirmed: bool = False
    companion_name: str = Field(default="HeartBuddy", min_length=1, max_length=120)
    companion_gender: CompanionGender = "neutral"
    companion_mode: CompanionMode = "friend"
    companion_tone: CompanionTone = "soft"
    user_support_preference: str | None = Field(default=None, max_length=2000)
    emotional_boundaries: str | None = Field(default=None, max_length=2000)
    initial_goal_text: str | None = Field(default=None, max_length=2000)
    initial_memory_text: str | None = Field(default=None, max_length=2000)


class OnboardingCompleteResponse(BaseModel):
    user: UserRead
    profile: ProfileRead
