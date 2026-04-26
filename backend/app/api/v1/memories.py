from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.exceptions import AppError
from app.models.memory import Memory
from app.models.user import User
from app.schemas.memory import DeleteAllConfirmation, MemoryCreate, MemoryExport, MemoryRead, MemoryUpdate
from app.services.memory_service import (
    delete_all_user_memories,
    delete_user_memory,
    list_user_memories,
    save_memory,
    set_memory_active,
    update_user_memory,
)

router = APIRouter()


@router.get("", response_model=list[MemoryRead])
def list_memories(
    memory_type: str | None = None,
    emotion: str | None = None,
    active_only: bool = True,
    search: str | None = None,
    limit: int = Query(default=100, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Memory]:
    return list_user_memories(db, current_user.id, memory_type, emotion, active_only, search, limit, offset)


@router.post("", response_model=MemoryRead)
def create_memory(
    payload: MemoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Memory:
    memory = save_memory(
        db,
        current_user.id,
        payload.memory_text,
        payload.memory_type,
        payload.emotion,
        payload.importance_score,
    )
    db.commit()
    db.refresh(memory)
    return memory


@router.put("/{memory_id}", response_model=MemoryRead)
def update_memory(
    memory_id: UUID,
    payload: MemoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Memory:
    return update_user_memory(db, current_user.id, memory_id, payload)


@router.delete("/{memory_id}")
def delete_memory(
    memory_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, bool]:
    delete_user_memory(db, current_user.id, memory_id)
    return {"deleted": True}


@router.post("/{memory_id}/deactivate", response_model=MemoryRead)
def deactivate_memory(
    memory_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Memory:
    return set_memory_active(db, current_user.id, memory_id, False)


@router.post("/{memory_id}/activate", response_model=MemoryRead)
def activate_memory(
    memory_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Memory:
    return set_memory_active(db, current_user.id, memory_id, True)


@router.post("/delete-all")
def delete_all_memories(
    payload: DeleteAllConfirmation,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, int]:
    if not payload.confirm:
        raise AppError("Confirmation required")
    return {"deleted_count": delete_all_user_memories(db, current_user.id)}


@router.get("/export", response_model=MemoryExport)
def export_memories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MemoryExport:
    memories = list_user_memories(db, current_user.id, active_only=False, limit=200, offset=0)
    return MemoryExport(exported_at=datetime.now(UTC), user_id=current_user.id, memories=memories)
