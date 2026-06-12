def test_catalog_requires_auth(client):
    response = client.get("/api/catalog")
    assert response.status_code == 401


def test_catalog_lists_document_types(client):
    client.post(
        "/api/auth/signup",
        json={"email": "catalog@example.com", "password": "secret123"},
    )
    response = client.get("/api/catalog")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 11
    ids = {entry["id"] for entry in data}
    assert "mutual-nda" in ids
    assert "csa" in ids
    assert "pilot" in ids
