from pydantic import BaseModel, Field


class NDAFields(BaseModel):
    party1Company: str = ""
    party1Name: str = ""
    party1Title: str = ""
    party1Address: str = ""
    party2Company: str = ""
    party2Name: str = ""
    party2Title: str = ""
    party2Address: str = ""
    purpose: str = (
        "Evaluating whether to enter into a business relationship with the other party."
    )
    effectiveDate: str = ""
    mndaTerm: str = "1 year from Effective Date"
    termOfConfidentiality: str = "1 year from Effective Date"
    governingLaw: str = ""
    jurisdiction: str = ""


def empty_nda() -> NDAFields:
    from datetime import date

    return NDAFields(effectiveDate=date.today().isoformat())


def merge_nda_fields(current: NDAFields, updates: NDAFields) -> NDAFields:
    merged = current.model_dump()
    for key, value in updates.model_dump().items():
        if value and str(value).strip():
            merged[key] = value
    return NDAFields(**merged)


def is_nda_complete(fields: NDAFields) -> bool:
    required = [
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
    data = fields.model_dump()
    return all(str(data[key]).strip() for key in required)


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    fields: NDAFields | None = None


class ChatResponse(BaseModel):
    message: str
    fields: NDAFields
    is_complete: bool
