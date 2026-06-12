from fastapi import APIRouter, Depends

from app.deps import get_current_user
from app.models import User
from app.schemas.nda import (
    ChatRequest,
    ChatResponse,
    empty_nda,
    is_nda_complete,
    merge_nda_fields,
)
from app.services import llm

router = APIRouter()

GREETING = (
    "Hi! I'm Prelegal, your AI assistant for drafting a Mutual Non-Disclosure Agreement. "
    "I'll ask a few questions to fill in the document — let's start with your company. "
    "What's the name of Party 1 (your organization)?"
)


@router.get("/greeting")
def greeting(_user: User = Depends(get_current_user)):
    return {"message": GREETING}


@router.post("/message", response_model=ChatResponse)
def message(body: ChatRequest, _user: User = Depends(get_current_user)):
    current = body.fields or empty_nda()
    conversation = [{"role": m.role, "content": m.content} for m in body.messages]

    assistant_message, extracted, llm_complete = llm.chat_completion(
        conversation, current
    )
    merged = merge_nda_fields(current, extracted)
    complete = llm_complete or is_nda_complete(merged)

    return ChatResponse(
        message=assistant_message,
        fields=merged,
        is_complete=complete,
    )
