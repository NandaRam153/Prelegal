from fastapi import APIRouter, Depends

from app.deps import get_current_user
from app.models import User
from app.schemas.chat import CatalogEntry
from app.services import document_registry

router = APIRouter()


@router.get("", response_model=list[CatalogEntry])
def list_catalog(_user: User = Depends(get_current_user)):
    return [
        CatalogEntry(
            id=config.id,
            name=config.name,
            description=config.description,
            filename=config.filename,
        )
        for config in document_registry.list_types()
    ]
