import json
import os
import time
from typing import Any

import litellm
from litellm.exceptions import RateLimitError

from app.services.document_registry import (
    DETECTION_SYSTEM_PROMPT,
    DOCUMENT_TYPES,
    build_response_schema,
    build_system_prompt,
    empty_fields,
)

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}
MAX_CONVERSATION_MESSAGES = 24
MAX_RATE_LIMIT_RETRIES = 2


class ChatServiceError(Exception):
    """Raised when the LLM call fails in a user-recoverable way."""

    def __init__(self, message: str, *, retry_after_seconds: int | None = None):
        super().__init__(message)
        self.retry_after_seconds = retry_after_seconds


def _trim_conversation(conversation: list[dict[str, str]]) -> list[dict[str, str]]:
    if len(conversation) <= MAX_CONVERSATION_MESSAGES:
        return conversation
    return conversation[-MAX_CONVERSATION_MESSAGES:]


def _build_messages(
    conversation: list[dict[str, str]],
    document_type_id: str | None,
    current_fields: dict[str, str],
) -> list[dict[str, str]]:
    system_prompt = (
        build_system_prompt(document_type_id)
        if document_type_id
        else DETECTION_SYSTEM_PROMPT
    )
    fields_context = json.dumps(current_fields, indent=2)
    context = (
        f"Current document type: {document_type_id}\n"
        if document_type_id
        else "Current document type: not yet determined\n"
    )
    trimmed = _trim_conversation(conversation)
    return [
        {"role": "system", "content": system_prompt},
        {
            "role": "system",
            "content": (
                f"{context}Current extracted fields (merge new values into these):\n"
                f"{fields_context}"
            ),
        },
        *trimmed,
    ]


def _parse_retry_after(error: RateLimitError) -> int | None:
    response = getattr(error, "response", None)
    if response is not None:
        retry_after = response.headers.get("Retry-After")
        if retry_after and retry_after.isdigit():
            return int(retry_after)
    return None


def chat_completion(
    conversation: list[dict[str, str]],
    document_type_id: str | None,
    current_fields: dict[str, str],
) -> tuple[str, str | None, dict[str, str], bool]:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ChatServiceError("OPENROUTER_API_KEY is not configured")

    schema = build_response_schema(document_type_id)
    messages = _build_messages(conversation, document_type_id, current_fields)

    last_error: Exception | None = None
    for attempt in range(MAX_RATE_LIMIT_RETRIES + 1):
        try:
            response = litellm.completion(
                model=MODEL,
                messages=messages,
                api_key=api_key,
                response_format={
                    "type": "json_schema",
                    "json_schema": {
                        "name": "document_chat_response",
                        "strict": True,
                        "schema": schema,
                    },
                },
                reasoning_effort="low",
                extra_body=EXTRA_BODY,
            )
            break
        except RateLimitError as exc:
            last_error = exc
            retry_after = _parse_retry_after(exc) or 5
            if attempt >= MAX_RATE_LIMIT_RETRIES:
                raise ChatServiceError(
                    "The AI service is temporarily busy. Please wait a minute and try again.",
                    retry_after_seconds=retry_after,
                ) from exc
            time.sleep(min(retry_after, 10))
        except Exception as exc:
            raise ChatServiceError(
                "The AI service is unavailable right now. Please try again shortly."
            ) from exc
    else:
        raise ChatServiceError(
            "The AI service is temporarily busy. Please wait a minute and try again."
        ) from last_error

    content = response.choices[0].message.content
    if not content:
        raise ChatServiceError("The AI returned an empty response. Please try again.")

    try:
        parsed: dict[str, Any] = json.loads(content)
    except json.JSONDecodeError as exc:
        raise ChatServiceError("The AI returned an invalid response. Please try again.") from exc

    detected_type = parsed.get("document_type") or document_type_id
    extracted_fields = parsed.get("fields") or {}

    if detected_type and detected_type not in DOCUMENT_TYPES:
        raise ChatServiceError(f"Unknown document type: {detected_type}")

    normalized_fields = (
        {key: str(extracted_fields.get(key, "")) for key in empty_fields(detected_type)}
        if detected_type
        else {}
    )

    assistant_message = parsed.get("assistant_message") or ""
    if not assistant_message:
        raise ChatServiceError("The AI returned an incomplete response. Please try again.")

    return (
        assistant_message,
        detected_type,
        normalized_fields,
        bool(parsed.get("is_complete", False)),
    )
