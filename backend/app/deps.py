from fastapi import Cookie, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Session as UserSession
from app.models import User

SESSION_COOKIE = "prelegal_session"


def get_current_user(
    token: str | None = Cookie(default=None, alias=SESSION_COOKIE),
    db: Session = Depends(get_db),
) -> User:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    session = db.query(UserSession).filter(UserSession.token == token).first()
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
