# ── Stage 1: build Next.js static export ─────────────────────────────────────
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --prefer-offline

COPY frontend/ .
RUN npm run build


# ── Stage 2: Python / FastAPI runtime ────────────────────────────────────────
FROM python:3.12-slim AS runtime

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copy frontend static output from build stage
COPY --from=frontend-builder /app/frontend/out ./out

# Copy backend source
COPY backend/ ./backend/

# Install Python dependencies
WORKDIR /app/backend
RUN uv sync --no-dev --frozen

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
