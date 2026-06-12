from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    document_type: str | None = None
    fields: dict[str, str] | None = None


class ChatResponse(BaseModel):
    message: str
    document_type: str | None = None
    fields: dict[str, str]
    is_complete: bool


class CatalogEntry(BaseModel):
    id: str
    name: str
    description: str
    filename: str
