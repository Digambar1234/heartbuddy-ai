from fastapi import status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest


def register_user(db: Session, payload: RegisterRequest) -> AuthResponse:
    existing = db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing:
        raise AppError("Email already exists", status.HTTP_409_CONFLICT)

    user = User(
        name=payload.name.strip(),
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(str(user.id))
    return AuthResponse(access_token=token, user=user)


def login_user(db: Session, payload: LoginRequest) -> AuthResponse:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.password_hash):
        raise AppError("Invalid credentials", status.HTTP_401_UNAUTHORIZED)

    token = create_access_token(str(user.id))
    return AuthResponse(access_token=token, user=user)
