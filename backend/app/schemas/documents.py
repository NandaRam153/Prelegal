from datetime import datetime

from pydantic import BaseModel, Field


class DocumentCreate(BaseModel):
    document_type: str
    fields: dict[str, str] = Field(default_factory=dict)
    is_complete: bool = False
    title: str | None = None


class DocumentUpdate(BaseModel):
    document_type: str | None = None
    fields: dict[str, str] | None = None
    is_complete: bool | None = None
    title: str | None = None


class DocumentSummary(BaseModel):
    id: int
    document_type: str
    title: str
    is_complete: bool
    updated_at: datetime

    model_config = {"from_attributes": True}


class DocumentResponse(BaseModel):
    id: int
    document_type: str
    title: str
    fields: dict[str, str]
    is_complete: bool
    created_at: datetime
    updated_at: datetime
