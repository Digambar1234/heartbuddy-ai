import uuid
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.memory import Memory
from app.models.mood_log import MoodLog
from app.models.user import User
from app.models.user_goal import UserGoal


def export_user_data(db: Session, user: User) -> dict[str, Any]:
    profile = user.profile
    memories = list(db.scalars(select(Memory).where(Memory.user_id == user.id).order_by(Memory.created_at.desc())))
    mood_logs = list(db.scalars(select(MoodLog).where(MoodLog.user_id == user.id).order_by(MoodLog.created_at.desc())))
    goals = list(db.scalars(select(UserGoal).where(UserGoal.user_id == user.id).order_by(UserGoal.created_at.desc())))
    conversations = list(
        db.scalars(select(Conversation).where(Conversation.user_id == user.id).order_by(Conversation.updated_at.desc()))
    )

    return {
        "exported_at": datetime.now(UTC),
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "gender": user.gender,
            "age_confirmed": user.age_confirmed,
            "onboarding_completed": user.onboarding_completed,
            "created_at": user.created_at,
        },
        "profile": _profile_dict(profile) if profile else None,
        "memories": [_memory_dict(memory) for memory in memories],
        "mood_logs": [_mood_dict(log) for log in mood_logs],
        "goals": [{"id": goal.id, "goal_text": goal.goal_text, "status": goal.status} for goal in goals],
        "conversations": [
            {
                "id": conversation.id,
                "title": conversation.title,
                "created_at": conversation.created_at,
                "updated_at": conversation.updated_at,
            }
            for conversation in conversations
        ],
    }


def _profile_dict(profile) -> dict[str, Any]:
    return {
        "companion_name": profile.companion_name,
        "companion_gender": profile.companion_gender,
        "companion_mode": profile.companion_mode,
        "companion_tone": profile.companion_tone,
        "user_support_preference": profile.user_support_preference,
        "emotional_boundaries": profile.emotional_boundaries,
    }


def _memory_dict(memory: Memory) -> dict[str, Any]:
    return {
        "id": memory.id,
        "memory_text": memory.memory_text,
        "memory_type": memory.memory_type,
        "emotion": memory.emotion,
        "importance_score": memory.importance_score,
        "is_active": memory.is_active,
        "created_at": memory.created_at,
        "updated_at": memory.updated_at,
        "last_used_at": memory.last_used_at,
    }


def _mood_dict(log: MoodLog) -> dict[str, Any]:
    return {"id": log.id, "mood": log.mood, "intensity": log.intensity, "reason": log.reason, "created_at": log.created_at}
