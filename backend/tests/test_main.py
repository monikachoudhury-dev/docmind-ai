from pathlib import Path
from unittest.mock import patch

from main import app
from app.models.user import User
from app.models.document import Document

def test_root_endpoint(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to DocMind AI API",
        "status": "running",
    }


def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
    }
def test_auth_home(client):
    response = client.get("/auth/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Authentication API Working"
    }


def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"
    assert "id" in data


def test_login_user(client):
    register_response = client.post(
        "/auth/register",
        json={
            "username": "loginuser",
            "email": "loginuser@example.com",
            "password": "TestPassword123!",
        },
    )

    assert register_response.status_code == 200

    response = client.post(
        "/auth/login",
        data={
            "username": "loginuser@example.com",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_get_logged_in_user(client):
    client.post(
        "/auth/register",
        json={
            "username": "meuser",
            "email": "meuser@example.com",
            "password": "TestPassword123!",
        },
    )

    login_response = client.post(
        "/auth/login",
        data={
            "username": "meuser@example.com",
            "password": "TestPassword123!",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    response = client.get(
        "/auth/me",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["username"] == "meuser"
    assert data["email"] == "meuser@example.com"
    assert "id" in data
    assert data["is_active"] is True


def test_get_logged_in_user_without_token(client):
    response = client.get("/auth/me")

    assert response.status_code == 401


def test_upload_pdf_authenticated_user(client):
    client.post(
        "/auth/register",
        json={
            "username": "pdfuser",
            "email": "pdfuser@example.com",
            "password": "TestPassword123!",
        },
    )

    login_response = client.post(
        "/auth/login",
        data={
            "username": "pdfuser@example.com",
            "password": "TestPassword123!",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    fake_pdf_content = b"%PDF-1.4 fake test pdf"

    with patch(
        "app.api.pdf.process_pdf",
        return_value={"chunks": ["test chunk"]},
    ), patch(
        "app.api.pdf.create_vector_store",
        return_value="test-vector-store",
    ):
        response = client.post(
            "/pdf/upload",
            headers={
                "Authorization": f"Bearer {token}",
            },
            files={
                "file": (
                    "test.pdf",
                    fake_pdf_content,
                    "application/pdf",
                )
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "PDF uploaded successfully."
    assert data["document"]["filename"] == "test.pdf"
    assert "id" in data["document"]
    Path("uploads/test.pdf").unlink(missing_ok=True)


def test_user_cannot_chat_with_another_users_document(client, db_session):
    # Create User A
    register_a = client.post(
        "/auth/register",
        json={
            "username": "usera",
            "email": "usera@example.com",
            "password": "TestPassword123!",
        },
    )

    assert register_a.status_code == 200

    login_a = client.post(
        "/auth/login",
        data={
            "username": "usera@example.com",
            "password": "TestPassword123!",
        },
    )

    assert login_a.status_code == 200
    token_a = login_a.json()["access_token"]

    # Create User B
    register_b = client.post(
        "/auth/register",
        json={
            "username": "userb",
            "email": "userb@example.com",
            "password": "TestPassword123!",
        },
    )

    assert register_b.status_code == 200

    login_b = client.post(
        "/auth/login",
        data={
            "username": "userb@example.com",
            "password": "TestPassword123!",
        },
    )

    assert login_b.status_code == 200

    # Find the actual User B from the test database
    user_b = db_session.query(User).filter(
        User.email == "userb@example.com"
    ).first()

    assert user_b is not None

    # Create a document owned by User B
    document = Document(
        filename="private.pdf",
        file_path="uploads/private.pdf",
        owner_id=user_b.id,
    )

    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # User A tries to access User B's document
    response = client.get(
        "/chat/",
        params={
            "document_id": document.id,
            "question": "What is in this document?",
        },
        headers={
            "Authorization": f"Bearer {token_a}",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found."