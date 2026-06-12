import json
import os
from typing import Any

import litellm

from app.schemas.nda import NDAFields

MODEL = "openrouter/openai/gpt-oss-120b"

SYSTEM_PROMPT = """You are Prelegal, a friendly legal document assistant helping users draft a Mutual Non-Disclosure Agreement (Common Paper standard).

Your job is to gather these fields through natural conversation, one or two at a time:
- Party 1: company name, signatory name, title, notice address (email or postal)
- Party 2: company name, signatory name, title, notice address
- Purpose (how confidential information may be used)
- Effective date (YYYY-MM-DD)
- MNDA term (e.g. "1 year from Effective Date" or "Continues until terminated")
- Term of confidentiality (e.g. "1 year from Effective Date" or "In perpetuity")
- Governing law (US state)
- Jurisdiction (courts, e.g. "New Castle, DE")

Rules:
- Ask follow-up questions until all fields are collected.
- Extract any values the user provides into the fields object.
- Use today's date as default effective date if not specified.
- When all fields are filled, confirm the document is ready and set is_complete to true.
- Keep replies concise and conversational.
"""

NDA_FIELD_NAMES = [
    "party1Company",
    "party1Name",
    "party1Title",
    "party1Address",
    "party2Company",
    "party2Name",
    "party2Title",
    "party2Address",
    "purpose",
    "effectiveDate",
    "mndaTerm",
    "termOfConfidentiality",
    "governingLaw",
    "jurisdiction",
]

RESPONSE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "assistant_message": {"type": "string"},
        "fields": {
            "type": "object",
            "properties": {name: {"type": "string"} for name in NDA_FIELD_NAMES},
            "required": NDA_FIELD_NAMES,
            "additionalProperties": False,
        },
        "is_complete": {"type": "boolean"},
    },
    "required": ["assistant_message", "fields", "is_complete"],
    "additionalProperties": False,
}


def _build_messages(
    conversation: list[dict[str, str]], current_fields: NDAFields
) -> list[dict[str, str]]:
    fields_context = json.dumps(current_fields.model_dump(), indent=2)
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "system",
            "content": f"Current extracted fields (merge new values into these):\n{fields_context}",
        },
        *conversation,
    ]


def chat_completion(
    conversation: list[dict[str, str]], current_fields: NDAFields
) -> tuple[str, NDAFields, bool]:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured")

    response = litellm.completion(
        model=MODEL,
        messages=_build_messages(conversation, current_fields),
        api_key=api_key,
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "nda_chat_response",
                "strict": True,
                "schema": RESPONSE_SCHEMA,
            },
        },
        extra_body={
            "provider": {
                "order": ["Cerebras"],
                "allow_fallbacks": False,
            }
        },
    )

    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("Empty response from language model")

    parsed = json.loads(content)
    extracted = NDAFields(**parsed.get("fields", {}))
    return (
        parsed["assistant_message"],
        extracted,
        bool(parsed.get("is_complete", False)),
    )
