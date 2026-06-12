import json
import os
from typing import Any

import litellm

from app.services.document_registry import (
    DETECTION_SYSTEM_PROMPT,
    DOCUMENT_TYPES,
    build_response_schema,
    build_system_prompt,
    empty_fields,
)

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["Cerebras"], "allow_fallbacks": False}}


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
    return [
        {"role": "system", "content": system_prompt},
        {
            "role": "system",
            "content": (
                f"{context}Current extracted fields (merge new values into these):\n"
                f"{fields_context}"
            ),
        },
        *conversation,
    ]


def chat_completion(
    conversation: list[dict[str, str]],
    document_type_id: str | None,
    current_fields: dict[str, str],
) -> tuple[str, str | None, dict[str, str], bool]:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured")

    schema = build_response_schema(document_type_id)
    response = litellm.completion(
        model=MODEL,
        messages=_build_messages(conversation, document_type_id, current_fields),
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

    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("Empty response from language model")

    parsed: dict[str, Any] = json.loads(content)
    detected_type = parsed.get("document_type") or document_type_id
    extracted_fields = parsed.get("fields") or {}

    if detected_type and detected_type not in DOCUMENT_TYPES:
        raise RuntimeError(f"Unknown document type: {detected_type}")

    normalized_fields = (
        {key: str(extracted_fields.get(key, "")) for key in empty_fields(detected_type)}
        if detected_type
        else {}
    )

    return (
        parsed["assistant_message"],
        detected_type,
        normalized_fields,
        bool(parsed.get("is_complete", False)),
    )
