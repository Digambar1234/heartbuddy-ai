import re
import uuid
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta

from fastapi import status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models.mood_log import MoodLog
from app.schemas.mood import MoodLogCreate, MoodSummary

STOP_WORDS = {
    "this",
    "that",
    "with",
    "when",
    "today",
    "because",
    "feel",
    "feeling",
    "myself",
    "people",
    "really",
}


def create_mood_log(db: Session, user_id: uuid.UUID, payload: MoodLogCreate) -> MoodLog:
    log = MoodLog(user_id=user_id, mood=payload.mood, intensity=payload.intensity, reason=payload.reason)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def list_mood_logs(
    db: Session,
    user_id: uuid.UUID,
    limit: int = 30,
    offset: int = 0,
    mood: str | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
) -> list[MoodLog]:
    query = select(MoodLog).where(MoodLog.user_id == user_id)
    if mood:
        query = query.where(MoodLog.mood == mood)
    if date_from:
        query = query.where(MoodLog.created_at >= datetime.combine(date_from, datetime.min.time()))
    if date_to:
        query = query.where(MoodLog.created_at <= datetime.combine(date_to, datetime.max.time()))
    return list(
        db.scalars(query.order_by(MoodLog.created_at.desc()).limit(min(limit, 100)).offset(max(offset, 0)))
    )


def get_mood_summary(db: Session, user_id: uuid.UUID) -> MoodSummary:
    logs = list(db.scalars(select(MoodLog).where(MoodLog.user_id == user_id).order_by(MoodLog.created_at.desc())))
    if not logs:
        return MoodSummary(
            total_logs=0,
            most_common_mood=None,
            average_intensity=None,
            recent_mood=None,
            recent_intensity=None,
            common_triggers=[],
            last_7_days=[],
        )

    mood_counts = Counter(log.mood for log in logs)
    average = round(sum(log.intensity for log in logs) / len(logs), 1)
    recent = logs[0]
    trigger_counts = Counter()
    for log in logs:
        if log.reason:
            trigger_counts.update(_reason_keywords(log.reason))

    start = date.today() - timedelta(days=6)
    grouped: dict[date, list[MoodLog]] = defaultdict(list)
    for log in logs:
        log_date = log.created_at.date()
        if log_date >= start:
            grouped[log_date].append(log)

    days = []
    for index in range(7):
        day = start + timedelta(days=index)
        day_logs = grouped.get(day, [])
        if day_logs:
            days.append(
                {
                    "date": day,
                    "average_intensity": round(sum(item.intensity for item in day_logs) / len(day_logs), 1),
                    "dominant_mood": Counter(item.mood for item in day_logs).most_common(1)[0][0],
                }
            )

    return MoodSummary(
        total_logs=len(logs),
        most_common_mood=mood_counts.most_common(1)[0][0],
        average_intensity=average,
        recent_mood=recent.mood,
        recent_intensity=recent.intensity,
        common_triggers=[word for word, _ in trigger_counts.most_common(5)],
        last_7_days=days,
    )


def delete_mood_log(db: Session, user_id: uuid.UUID, mood_log_id: uuid.UUID) -> None:
    log = db.scalar(select(MoodLog).where(MoodLog.id == mood_log_id, MoodLog.user_id == user_id))
    if log is None:
        raise AppError("Mood log not found", status.HTTP_404_NOT_FOUND)
    db.delete(log)
    db.commit()


def delete_all_mood_logs(db: Session, user_id: uuid.UUID) -> int:
    result = db.execute(delete(MoodLog).where(MoodLog.user_id == user_id))
    db.commit()
    return int(result.rowcount or 0)


def _reason_keywords(reason: str) -> list[str]:
    return [word for word in re.findall(r"[a-zA-Z']{4,}", reason.lower()) if word not in STOP_WORDS]
