from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.database import init_db
from app.routers import auth, chat

_OUT_DIR = Path(__file__).parent.parent.parent / "out"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Prelegal API", lifespan=lifespan)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}


# Serve Next.js static export at root — must be last to avoid shadowing API routes
if _OUT_DIR.exists():
    app.mount("/", StaticFiles(directory=str(_OUT_DIR), html=True), name="static")
else:

    @app.get("/")
    async def root():
        return {"message": "Frontend not built. Run `npm run build` in frontend/."}
