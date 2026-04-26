# HeartBuddy AI

Your personal AI companion who remembers you, understands you, and supports you every day.

HeartBuddy AI is a production-ready MVP foundation for a personalized emotional companion SaaS. It includes authentication, onboarding, companion settings, memory-aware chat, safety handling, mood tracking, privacy controls, and deployment-ready frontend/backend apps.

## Safety Disclaimer

HeartBuddy AI provides emotional support and companionship, but it is not a medical, therapeutic, or emergency service. It is not a licensed therapist, doctor, cure for depression, real romantic partner, or replacement for human relationships.

## Features

- Auth, onboarding, user profile, and companion settings
- Memory-aware AI chat with conversation and message storage
- Rule-based crisis detection and safe crisis response
- Rule-based emotion detection and memory extraction
- OpenAI/Groq provider abstraction with Gemini placeholder and local fallback
- Memory management: list, search, add, edit, activate, deactivate, delete, delete all, export
- Mood tracking: check-ins, history, summary, common triggers, 7-day trend
- Privacy controls: full data export, delete memories, delete mood logs
- Polished responsive React UI

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios, Zustand, Framer Motion, Lucide React
- Backend: FastAPI, Python 3.11+, SQLAlchemy 2.x, Alembic, Pydantic v2, PostgreSQL, JWT auth, passlib/bcrypt
- Deployment: Vercel frontend, Render backend, Supabase/Neon/Render PostgreSQL

## Architecture

```text
heartbuddy-ai/
├── frontend/   React app
├── backend/    FastAPI app
├── docker-compose.yml   optional local PostgreSQL only
└── README.md
```

## Environment Variables

Backend `backend/.env`:

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

Frontend `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Do not commit real secrets.

## Local Setup Without Docker

Docker is optional only. Use Supabase, Neon, Render PostgreSQL, or a local PostgreSQL install and paste its URI into `DATABASE_URL`.

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`. Backend health check: `http://localhost:8000/health`.

## External PostgreSQL

Supabase:

1. Create a Supabase project.
2. Open Project Settings, Database.
3. Copy the PostgreSQL connection string.
4. Set it as `DATABASE_URL`.
5. Run `alembic upgrade head`.

Neon:

1. Create a Neon project.
2. Open Connection Details.
3. Copy the PostgreSQL URI.
4. Set it as `DATABASE_URL`.
5. Run `alembic upgrade head`.

Some hosted providers require SSL parameters. Use the exact URI they provide.

## Optional Docker PostgreSQL

If Docker is installed:

```bash
docker compose up -d postgres
```

Then use:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/heartbuddy
```

## Alembic

```bash
cd backend
alembic upgrade head
alembic heads
```

Current MVP migration head: `202604260003`.

## AI Provider Setup

Set `LLM_PROVIDER=openai` with `OPENAI_API_KEY`, or set `LLM_PROVIDER=groq` with `GROQ_API_KEY`. `grok` is accepted as an alias, but the provider variable should preferably be `groq`.

For Groq:

```env
LLM_PROVIDER=groq
GROQ_API_KEY=your-rotated-groq-key
GROQ_MODEL=llama-3.1-8b-instant
```

If no provider key is supplied, chat still works with a safe fallback response and returns `used_fallback_response=true`.

## Key Screens

- `/dashboard`: companion, quick mood, memory summary, mood summary, recent conversations
- `/chat`: memory-aware emotional companion chat
- `/memories`: user-controlled memory management
- `/mood`: mood tracking and summary
- `/settings`: companion settings and privacy shortcuts
- `/privacy`: export/delete personal data

## Testing Flows

Memory management:

1. Open `/memories`.
2. Add: `I feel demotivated when I compare myself with my friends.`
3. Edit, deactivate, activate, delete, export, and delete all.

Mood tracking:

1. Open `/mood`.
2. Add a mood check-in.
3. Confirm summary and history update.
4. Delete a mood log.

Chat personalization:

1. Add the comparison memory above.
2. Open `/chat`.
3. Send: `I feel useless again.`
4. HeartBuddy should retrieve relevant memory context.

Crisis safety:

1. Send: `I want to die.`
2. Response should be crisis-safe, non-romantic, and include urgent real-world support guidance.

Privacy:

1. Open `/privacy`.
2. Export data.
3. Delete memories or mood logs with confirmation.

## Deployment

Vercel frontend:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_BASE_URL` to the deployed backend URL

Render backend:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set all backend environment variables
- Run `alembic upgrade head` as a release command or one-off job
- Use Supabase, Neon, Render PostgreSQL, or another external PostgreSQL URL

## Completed MVP

- Part 1: auth, onboarding, user profile, companion settings, base database, polished frontend foundation
- Part 2: chat engine, conversations, messages, safety detection, emotion detection, memory retrieval/extraction, LLM abstraction
- Part 3: memory management, mood tracking, privacy controls, improved dashboard/settings, external database deployment readiness

## Future Improvements

- Vector memory search
- Streaming chat responses
- LLM-based memory extraction and summarization
- Advanced mood analytics
- Billing and subscriptions
- Observability, rate limiting, and production tests

## Troubleshooting

- Database connection error: verify `DATABASE_URL`, provider SSL requirements, credentials, and IP allowlists.
- Alembic migration error: run from `backend`, ensure `.env` exists, and check `alembic heads`.
- CORS error: set `FRONTEND_ORIGIN` to the exact frontend URL.
- Frontend cannot connect: set `VITE_API_BASE_URL` to the backend base URL without `/api/v1`.
- 401 unauthorized: login again; stale tokens are cleared by the frontend.
- AI provider key missing: expected in fallback mode; chat still works.
- bcrypt/passlib issue: recreate the Python 3.11+ virtual environment and reinstall requirements.
- npm install issue: confirm Node 18+ or newer, then rerun `npm install`.
