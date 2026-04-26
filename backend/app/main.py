from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, chat, memories, mood, onboarding, privacy, settings, users
from app.core.config import settings as app_settings
from app.core.exceptions import register_exception_handlers


app = FastAPI(
    title="HeartBuddy AI API",
    description="Production-ready foundation API for HeartBuddy AI.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[app_settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(onboarding.router, prefix="/api/v1/onboarding", tags=["Onboarding"])
app.include_router(settings.router, prefix="/api/v1/settings", tags=["Settings"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(memories.router, prefix="/api/v1/memories", tags=["Memories"])
app.include_router(mood.router, prefix="/api/v1/mood", tags=["Mood"])
app.include_router(privacy.router, prefix="/api/v1/privacy", tags=["Privacy"])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "heartbuddy-ai-api"}
