from unittest.mock import patch
import json

from app.schemas.nda import empty_nda, is_nda_complete, merge_nda_fields
from app.services import document_registry
from app.services import llm
from app.services.llm import _trim_conversation

SESSION_COOKIE = "prelegal_session"


def _signup(client, email="chat@example.com", password="secret123"):
    return client.post(
        "/api/auth/signup",
        json={"email": email, "password": password},
    )


def test_greeting_requires_auth(client):
    response = client.get("/api/chat/greeting")
    assert response.status_code == 401


def test_greeting_returns_message(client):
    _signup(client)
    response = client.get("/api/chat/greeting")
    assert response.status_code == 200
    data = response.json()
    assert "legal agreements" in data["message"].lower()


def test_message_requires_auth(client):
    response = client.post(
        "/api/chat/message",
        json={"messages": [{"role": "user", "content": "Acme Corp"}]},
    )
    assert response.status_code == 401


def test_trim_conversation_limits_history():
    conversation = [{"role": "user", "content": f"msg-{i}"} for i in range(30)]
    trimmed = _trim_conversation(conversation)
    assert len(trimmed) == 24
    assert trimmed[0]["content"] == "msg-6"


@patch("app.services.llm.time.sleep")
@patch("app.services.llm.litellm.completion")
def test_message_returns_service_unavailable_on_rate_limit(
    mock_completion, _mock_sleep, client
):
    from litellm.exceptions import RateLimitError

    _signup(client)
    mock_completion.side_effect = RateLimitError(
        message="rate limited",
        llm_provider="openrouter",
        model=llm.MODEL,
    )

    response = client.post(
        "/api/chat/message",
        json={"messages": [{"role": "user", "content": "I need an NDA"}]},
    )

    assert response.status_code == 503
    assert "temporarily busy" in response.json()["detail"].lower()


@patch("app.services.llm.litellm.completion")
def test_message_detects_document_type(mock_completion, client):
    _signup(client)
    mock_completion.return_value.choices = [
        type(
            "Choice",
            (),
            {
                "message": type(
                    "Message",
                    (),
                    {
                        "content": json.dumps(
                            {
                                "assistant_message": "Great, let's draft an NDA. What's Party 1's company?",
                                "document_type": "mutual-nda",
                                "fields": {},
                                "is_complete": False,
                            }
                        )
                    },
                )()
            },
        )()
    ]

    response = client.post(
        "/api/chat/message",
        json={
            "messages": [{"role": "user", "content": "I need a mutual NDA"}],
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["document_type"] == "mutual-nda"
    assert data["is_complete"] is False


@patch("app.services.llm.litellm.completion")
def test_message_extracts_fields(mock_completion, client):
    _signup(client)
    mock_completion.return_value.choices = [
        type(
            "Choice",
            (),
            {
                "message": type(
                    "Message",
                    (),
                    {
                        "content": (
                            '{"assistant_message": "Great, what is Party 2?", '
                            '"document_type": "mutual-nda", '
                            '"fields": {"party1Company": "Acme Corp"}, '
                            '"is_complete": false}'
                        )
                    },
                )()
            },
        )()
    ]

    fields = document_registry.empty_fields("mutual-nda")
    response = client.post(
        "/api/chat/message",
        json={
            "messages": [{"role": "user", "content": "Acme Corp"}],
            "document_type": "mutual-nda",
            "fields": fields,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["fields"]["party1Company"] == "Acme Corp"
    assert data["message"] == "Great, what is Party 2?"
    assert data["is_complete"] is False


@patch("app.services.llm.litellm.completion")
def test_message_marks_complete_when_all_fields_present(mock_completion, client):
    _signup(client)
    complete_fields = {
        "party1Company": "Acme",
        "party1Name": "Jane",
        "party1Title": "CEO",
        "party1Address": "1 Main St",
        "party2Company": "Beta",
        "party2Name": "John",
        "party2Title": "CTO",
        "party2Address": "2 Oak Ave",
        "purpose": "Partnership evaluation",
        "effectiveDate": "2026-06-12",
        "mndaTerm": "1 year from Effective Date",
        "termOfConfidentiality": "1 year from Effective Date",
        "governingLaw": "Delaware",
        "jurisdiction": "New Castle, DE",
    }
    mock_completion.return_value.choices = [
        type(
            "Choice",
            (),
            {
                "message": type(
                    "Message",
                    (),
                    {
                        "content": json.dumps(
                            {
                                "assistant_message": "Your NDA is ready!",
                                "document_type": "mutual-nda",
                                "fields": complete_fields,
                                "is_complete": True,
                            }
                        )
                    },
                )()
            },
        )()
    ]

    response = client.post(
        "/api/chat/message",
        json={
            "messages": [{"role": "user", "content": "Delaware, New Castle DE"}],
            "document_type": "mutual-nda",
            "fields": document_registry.empty_fields("mutual-nda"),
        },
    )

    assert response.status_code == 200
    assert response.json()["is_complete"] is True


@patch("app.services.llm.litellm.completion")
def test_message_routes_csa_fields(mock_completion, client):
    _signup(client)
    mock_completion.return_value.choices = [
        type(
            "Choice",
            (),
            {
                "message": type(
                    "Message",
                    (),
                    {
                        "content": json.dumps(
                            {
                                "assistant_message": "Who is the customer?",
                                "document_type": "csa",
                                "fields": {"providerCompany": "CloudCo"},
                                "is_complete": False,
                            }
                        )
                    },
                )()
            },
        )()
    ]

    response = client.post(
        "/api/chat/message",
        json={
            "messages": [{"role": "user", "content": "Cloud service agreement for CloudCo"}],
            "document_type": "csa",
            "fields": document_registry.empty_fields("csa"),
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["document_type"] == "csa"
    assert data["fields"]["providerCompany"] == "CloudCo"


def test_merge_nda_fields_preserves_existing_values():
    current = empty_nda()
    current.party1Company = "Acme"
    updates = empty_nda()
    updates.party2Company = "Beta"
    merged = merge_nda_fields(current, updates)
    assert merged.party1Company == "Acme"
    assert merged.party2Company == "Beta"


def test_is_nda_complete():
    fields = empty_nda()
    assert is_nda_complete(fields) is False
    complete = empty_nda()
    for key in complete.model_dump():
        setattr(complete, key, "value")
    assert is_nda_complete(complete) is True
