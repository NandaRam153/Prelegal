# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation provides user sign-up/sign-in, an AI chat interface for Mutual NDA drafting with live preview and PDF download. Additional document types and document persistence are planned but not yet built.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use the Cerebras skill at `.claude/skills/cerebras/SKILL.md` to call LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. Use Structured Outputs so you can interpret results and populate fields in the legal document.

There is an `OPENROUTER_API_KEY` in the `.env` file in the project root. Docker Compose loads it via `env_file: .env`.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
Consider statically building the frontend and serving it via FastAPI, if that will work.  
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation Status

### Completed (PL-4)
- Docker multi-stage build (Node frontend + Python backend)
- FastAPI backend with SQLite (fresh DB each container start)
- Next.js static export (`frontend/src/`) served by FastAPI at localhost:8000
- User auth: sign-up, sign-in, sign-out, and session check via HttpOnly `prelegal_session` cookie (bcrypt password hashing)
- Login page at `/` and protected dashboard at `/dashboard/` (redirects unauthenticated users)
- Mutual NDA live preview and client-side PDF download (`@react-pdf/renderer`)
- Frontend API client at `frontend/src/lib/api.ts`; NDA field types at `frontend/src/lib/ndaTypes.ts`
- Start/stop scripts for Mac, Linux, Windows
- Jest test setup in `frontend/` (`__tests__/lib/ndaTypes.test.ts`)

### Completed (PL-5)
- AI chat interface (`frontend/src/components/ChatPanel.tsx`) replaces the manual form on the dashboard
- Chat API at `backend/app/routers/chat.py`; LLM integration at `backend/app/services/llm.py`
- NDA schemas and field merge/complete helpers at `backend/app/schemas/nda.py`
- LiteLLM via OpenRouter with Cerebras inference (`openrouter/openai/gpt-oss-120b`)
- Structured JSON outputs for reliable field extraction from conversation
- Live preview updates as AI extracts fields from chat
- AI greeting on dashboard load (`GET /api/chat/greeting`); conversational follow-up via `POST /api/chat/message`
- Download button appears when all required NDA fields are gathered
- Backend chat tests in `backend/tests/test_chat.py` (mocked LLM)

### Planned (PL-6) — not started
- Support for all 11 document types from catalog.json
- AI document-type detection and routing
- Dedicated preview/PDF components per document type

### Planned (PL-7) — not started
- Document persistence (save/load/delete)
- My Documents UI
- Document CRUD API endpoints (`/api/documents/*`)

Note: Basic auth (sign-up/sign-in/sign-out) is implemented in PL-4 using HttpOnly session cookies, not JWT.

### Current API Endpoints
- `POST /api/auth/signup` - Create new user account and set session cookie
- `POST /api/auth/signin` - Sign in and set session cookie
- `POST /api/auth/signout` - Clear session cookie
- `GET /api/auth/me` - Get current user info (requires session cookie)
- `GET /api/chat/greeting` - Get AI greeting for NDA chat (auth required)
- `POST /api/chat/message` - Send chat message; returns assistant reply, merged `NDAFields`, and `is_complete` (auth required)
- `GET /api/health` - Health check
