from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_current_user
from app.models import Document, User
from app.database import get_db
from app.schemas.documents import (
    DocumentCreate,
    DocumentResponse,
    DocumentSummary,
    DocumentUpdate,
)
from app.services import document_registry

router = APIRouter()


def _default_title(document_type: str, fields: dict[str, str]) -> str:
    config = document_registry.DOCUMENT_TYPES.get(document_type)
    if not config:
        return document_type
    if document_type == "mutual-nda":
        party1 = fields.get("party1Company") or "Party 1"
        party2 = fields.get("party2Company") or "Party 2"
        return f"{party1} / {party2} — Mutual NDA"
    provider = fields.get("providerCompany") or "Provider"
    customer = fields.get("customerCompany") or "Customer"
    return f"{provider} / {customer} — {config.name}"


def _get_user_document(
    document_id: int, user: User, db: Session
) -> Document:
    doc = (
        db.query(Document)
        .filter(Document.id == document_id, Document.user_id == user.id)
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


def _to_response(doc: Document) -> DocumentResponse:
    return DocumentResponse(
        id=doc.id,
        document_type=doc.document_type,
        title=doc.title,
        fields=doc.fields or {},
        is_complete=doc.is_complete,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


@router.get("", response_model=list[DocumentSummary])
def list_documents(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    docs = (
        db.query(Document)
        .filter(Document.user_id == user.id)
        .order_by(Document.updated_at.desc())
        .all()
    )
    return docs


@router.post("", response_model=DocumentResponse, status_code=201)
def create_document(
    body: DocumentCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.document_type not in document_registry.DOCUMENT_TYPES:
        raise HTTPException(status_code=400, detail="Unknown document type")

    doc = Document(
        user_id=user.id,
        document_type=body.document_type,
        title=body.title or _default_title(body.document_type, body.fields),
        fields=body.fields,
        is_complete=body.is_complete,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return _to_response(doc)


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _to_response(_get_user_document(document_id, user, db))


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    body: DocumentUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = _get_user_document(document_id, user, db)

    if body.document_type is not None:
        if body.document_type not in document_registry.DOCUMENT_TYPES:
            raise HTTPException(status_code=400, detail="Unknown document type")
        doc.document_type = body.document_type

    if body.fields is not None:
        doc.fields = body.fields

    if body.is_complete is not None:
        doc.is_complete = body.is_complete

    fields = doc.fields or {}
    doc.title = body.title or _default_title(doc.document_type, fields)

    db.commit()
    db.refresh(doc)
    return _to_response(doc)


@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = _get_user_document(document_id, user, db)
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted"}
