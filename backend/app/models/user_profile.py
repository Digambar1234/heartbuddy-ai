import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    companion_name: Mapped[str] = mapped_column(String(120), default="HeartBuddy", nullable=False)
    companion_gender: Mapped[str] = mapped_column(String(20), default="neutral", nullable=False)
    companion_mode: Mapped[str] = mapped_column(String(40), default="friend", nullable=False)
    companion_tone: Mapped[str] = mapped_column(String(40), default="soft", nullable=False)
    user_support_preference: Mapped[str | None] = mapped_column(Text, nullable=True)
    emotional_boundaries: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="profile")
