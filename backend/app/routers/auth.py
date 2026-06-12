import os
import uuid

import bcrypt
from fastapi import APIRouter, Cookie, Depends, HTTPException, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import SESSION_COOKIE, get_current_user
from app.models import Session as UserSession
from app.models import User

router = APIRouter()


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

SESSION_COOKIE = "prelegal_session"


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str

    model_config = {"from_attributes": True}


@router.post("/signup", response_model=UserResponse)
def signup(body: SignUpRequest, response: Response, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=body.email, password_hash=_hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    _create_session(user.id, response, db)
    return user


@router.post("/signin", response_model=UserResponse)
def signin(body: SignInRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not _verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    _create_session(user.id, response, db)
    return user


@router.post("/signout")
def signout(
    response: Response,
    token: str | None = Cookie(default=None, alias=SESSION_COOKIE),
    db: Session = Depends(get_db),
):
    if token:
        db.query(UserSession).filter(UserSession.token == token).delete()
        db.commit()
    response.delete_cookie(SESSION_COOKIE)
    return {"message": "Signed out"}


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


def _create_session(user_id: int, response: Response, db: Session) -> str:
    token = str(uuid.uuid4())
    session = UserSession(token=token, user_id=user_id)
    db.add(session)
    db.commit()
    _secure = os.getenv("COOKIE_SECURE", "true").lower() != "false"
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,
        secure=_secure,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
    )
    return token
