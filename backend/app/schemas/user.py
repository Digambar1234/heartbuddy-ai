from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserRead(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    gender: str | None
    date_of_birth: date | None
    age_confirmed: bool
    onboarding_completed: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
