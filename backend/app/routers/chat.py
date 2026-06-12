from fastapi import APIRouter, Depends, HTTPException

from app.deps import get_current_user
from app.models import User
from app.schemas.chat import ChatRequest, ChatResponse
from app.services import document_registry, llm

router = APIRouter()

GREETING = (
    "Hi! I'm Prelegal, your AI assistant for drafting legal agreements. "
    "I can help with NDAs, cloud service agreements, pilot agreements, DPAs, and more. "
    "What type of document would you like to create today?"
)


@router.get("/greeting")
def greeting(_user: User = Depends(get_current_user)):
    return {"message": GREETING}


@router.post("/message", response_model=ChatResponse)
def message(body: ChatRequest, _user: User = Depends(get_current_user)):
    document_type = body.document_type
    current = body.fields or (
        document_registry.empty_fields(document_type)
        if document_type
        else {}
    )
    conversation = [{"role": m.role, "content": m.content} for m in body.messages]

    try:
        assistant_message, detected_type, extracted, llm_complete = llm.chat_completion(
            conversation, document_type, current
        )
    except llm.ChatServiceError as exc:
        headers = {}
        if exc.retry_after_seconds is not None:
            headers["Retry-After"] = str(exc.retry_after_seconds)
        raise HTTPException(status_code=503, detail=str(exc), headers=headers) from exc

    resolved_type = detected_type or document_type
    if not resolved_type:
        return ChatResponse(
            message=assistant_message,
            document_type=None,
            fields={},
            is_complete=False,
        )

    merged = document_registry.merge_fields(current, extracted, resolved_type)
    complete = llm_complete or document_registry.is_complete(merged, resolved_type)

    return ChatResponse(
        message=assistant_message,
        document_type=resolved_type,
        fields=merged,
        is_complete=complete,
    )
