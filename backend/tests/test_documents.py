def _signup(client, email="docs@example.com", password="secret123"):
    return client.post(
        "/api/auth/signup",
        json={"email": email, "password": password},
    )


def _sample_fields():
    return {
        "party1Company": "Acme Corp",
        "party1Name": "Jane Smith",
        "party1Title": "CEO",
        "party1Address": "1 Main St",
        "party2Company": "Beta LLC",
        "party2Name": "John Doe",
        "party2Title": "CTO",
        "party2Address": "2 Oak Ave",
        "purpose": "Partnership evaluation",
        "effectiveDate": "2026-06-12",
        "mndaTerm": "1 year from Effective Date",
        "termOfConfidentiality": "1 year from Effective Date",
        "governingLaw": "Delaware",
        "jurisdiction": "New Castle, DE",
    }


def test_documents_require_auth(client):
    response = client.get("/api/documents")
    assert response.status_code == 401


def test_create_list_get_update_delete_document(client):
    _signup(client)

    create = client.post(
        "/api/documents",
        json={
            "document_type": "mutual-nda",
            "fields": _sample_fields(),
            "is_complete": False,
        },
    )
    assert create.status_code == 201
    created = create.json()
    assert created["document_type"] == "mutual-nda"
    assert created["fields"]["party1Company"] == "Acme Corp"
    assert "Mutual NDA" in created["title"]
    doc_id = created["id"]

    listing = client.get("/api/documents")
    assert listing.status_code == 200
    assert len(listing.json()) == 1
    assert listing.json()[0]["id"] == doc_id

    fetched = client.get(f"/api/documents/{doc_id}")
    assert fetched.status_code == 200
    assert fetched.json()["fields"]["party2Company"] == "Beta LLC"

    updated_fields = _sample_fields()
    updated_fields["party2Company"] = "Gamma Inc"
    update = client.put(
        f"/api/documents/{doc_id}",
        json={"fields": updated_fields, "is_complete": True},
    )
    assert update.status_code == 200
    assert update.json()["is_complete"] is True
    assert update.json()["fields"]["party2Company"] == "Gamma Inc"

    deleted = client.delete(f"/api/documents/{doc_id}")
    assert deleted.status_code == 200

    missing = client.get(f"/api/documents/{doc_id}")
    assert missing.status_code == 404


def test_user_cannot_access_other_users_document(client):
    _signup(client, email="owner@example.com")
    create = client.post(
        "/api/documents",
        json={"document_type": "mutual-nda", "fields": _sample_fields()},
    )
    doc_id = create.json()["id"]

    _signup(client, email="other@example.com")
    response = client.get(f"/api/documents/{doc_id}")
    assert response.status_code == 404


def test_create_rejects_unknown_document_type(client):
    _signup(client)
    response = client.post(
        "/api/documents",
        json={"document_type": "unknown-type", "fields": {}},
    )
    assert response.status_code == 400
