SESSION_COOKIE = "prelegal_session"


def test_signup_creates_user(client):
    response = client.post(
        "/api/auth/signup",
        json={"email": "test@example.com", "password": "secret123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert SESSION_COOKIE in response.cookies


def test_signup_duplicate_email(client):
    payload = {"email": "dup@example.com", "password": "pass"}
    client.post("/api/auth/signup", json=payload)
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_signin_valid_credentials(client):
    client.post(
        "/api/auth/signup",
        json={"email": "user@example.com", "password": "mypassword"},
    )
    response = client.post(
        "/api/auth/signin",
        json={"email": "user@example.com", "password": "mypassword"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "user@example.com"
    assert SESSION_COOKIE in response.cookies


def test_signin_wrong_password(client):
    client.post(
        "/api/auth/signup",
        json={"email": "user2@example.com", "password": "correct"},
    )
    response = client.post(
        "/api/auth/signin",
        json={"email": "user2@example.com", "password": "wrong"},
    )
    assert response.status_code == 401


def test_me_authenticated(client):
    client.post(
        "/api/auth/signup",
        json={"email": "me@example.com", "password": "pw"},
    )
    response = client.get("/api/auth/me")
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"


def test_me_unauthenticated(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_signout_clears_session(client):
    client.post(
        "/api/auth/signup",
        json={"email": "out@example.com", "password": "pw"},
    )
    client.post("/api/auth/signout")
    response = client.get("/api/auth/me")
    assert response.status_code == 401
