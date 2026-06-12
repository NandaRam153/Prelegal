import json
from functools import lru_cache
from pathlib import Path

_CATALOG_PATHS = (
    Path(__file__).resolve().parents[3] / "catalog.json",
    Path("/app/catalog.json"),
)


@lru_cache
def load_catalog() -> list[dict[str, str]]:
    for path in _CATALOG_PATHS:
        if path.exists():
            with path.open(encoding="utf-8") as handle:
                return json.load(handle)
    raise FileNotFoundError("catalog.json not found")


def list_document_types() -> list[dict[str, str]]:
    """Return catalog entries excluding the standalone NDA cover page."""
    return [
        entry
        for entry in load_catalog()
        if entry.get("filename") != "Mutual-NDA-coverpage.md"
    ]
