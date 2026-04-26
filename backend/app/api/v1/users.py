from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.user_goal import UserGoal
from app.schemas.user_goal import UserGoalCreate, UserGoalRead

router = APIRouter()


@router.get("/goals", response_model=list[UserGoalRead])
def list_goals(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> list[UserGoal]:
    return list(
        db.scalars(
            select(UserGoal)
            .where(UserGoal.user_id == current_user.id)
            .order_by(UserGoal.created_at.desc())
        )
    )


@router.post("/goals", response_model=UserGoalRead)
def create_goal(
    payload: UserGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserGoal:
    goal = UserGoal(
        user_id=current_user.id,
        goal_text=payload.goal_text.strip(),
        goal_category=payload.goal_category,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal
