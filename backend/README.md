# HeartBuddy AI Backend

FastAPI backend for the HeartBuddy AI MVP.

## Safety Positioning

HeartBuddy AI provides emotional support and companionship, but it is not a medical, therapeutic, or emergency service.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `.env`, set a strong `JWT_SECRET_KEY`, and set `DATABASE_URL`.

## Database

Docker is optional only. The backend works with any PostgreSQL database URL from Supabase, Neon, Render, or a local PostgreSQL installation.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

If Docker is installed and you want local PostgreSQL:

```bash
cd ..
docker compose up -d postgres
```

## Migrations

Run migrations against the database in `DATABASE_URL`:

```bash
alembic upgrade head
alembic heads
```

Current MVP head: `202604260003`.

## Run API

```bash
uvicorn app.main:app --reload
```

Health check: `GET http://localhost:8000/health`

API docs: `http://localhost:8000/docs`

## Key Endpoints

- Auth: `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/me`
- Onboarding: `/api/v1/onboarding/status`, `/api/v1/onboarding/complete`
- Settings: `/api/v1/settings/profile`
- Chat: `/api/v1/chat/conversations`, `/api/v1/chat/message`
- Memories: `/api/v1/memories`, `/api/v1/memories/export`, `/api/v1/memories/delete-all`
- Mood: `/api/v1/mood`, `/api/v1/mood/summary`
- Privacy: `/api/v1/privacy/export-data`, `/api/v1/privacy/delete-memories`, `/api/v1/privacy/delete-mood-logs`

## Environment Variables

```env
DATABASE_URL=
JWT_SECRET_KEY=change-this-secret-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
FRONTEND_ORIGIN=http://localhost:5173
LLM_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-8b-instant
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
ENABLE_LLM_MEMORY_EXTRACTION=false
ENABLE_LLM_EMOTION_DETECTION=false
```

## Chat Engine

`app/services/companion_service.py` orchestrates message storage, safety analysis, emotion detection, memory retrieval, prompt building, LLM response generation, assistant message storage, and memory extraction.

Set `LLM_PROVIDER=openai` for OpenAI or `LLM_PROVIDER=groq` for Groq. `grok` is accepted as an alias. If the selected provider key is empty, the API still works with a safe fallback response.

Groq example:

```env
LLM_PROVIDER=groq
GROQ_API_KEY=your-rotated-groq-key
GROQ_MODEL=llama-3.1-8b-instant
```

## Memory Testing

Create a memory:

```http
POST /api/v1/memories
```

Body:

```json
{
  "memory_text": "I feel demotivated when I compare myself with my friends.",
  "memory_type": "negative_pattern",
  "emotion": "demotivated",
  "importance_score": 8
}
```

## Mood Testing

```http
POST /api/v1/mood
GET /api/v1/mood/summary
DELETE /api/v1/mood/{mood_log_id}
```

## Privacy Testing

```http
GET /api/v1/privacy/export-data
POST /api/v1/privacy/delete-memories
POST /api/v1/privacy/delete-mood-logs
```

Destructive privacy endpoints require:

```json
{ "confirm": true }
```

Exports never include `password_hash`.
