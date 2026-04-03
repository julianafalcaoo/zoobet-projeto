from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_registrar_usuario():
    response = client.post(
        "/auth/registrar",
        json={
            "nome": "Teste",
            "email": "novoteste_10errado@email.com",
            "senha": "123456",
            "cpf": "12345678900"
        }
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_registrar_email_existente():
    client.post(
        "/auth/registrar",
        json={
            "nome": "Teste",
            "email": "duplicado@email.com",
            "senha": "123456",
            "cpf": "12345678910"
        }
    )

    response = client.post(
        "/auth/registrar",
        json={
            "nome": "Teste",
            "email": "duplicado@email.com",
            "senha": "123456",
            "cpf": "12345678910"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Email já cadastrado"


def test_login_usuario():
    client.post(
        "/auth/registrar",
        json={
            "nome": "Teste",
            "email": "login@email.com",
            "senha": "123456",
            "cpf": "12345678902"
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "login@email.com",
            "senha": "123456",
            "cpf": "12345678902"
        }
    )

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_invalido():
    client.post(
        "/auth/registrar",
        json={
            "nome": "Teste",
            "email": "senhaerrada@email.com",
            "senha": "123456",
            "cpf": "12345678911"
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "senhaerrada@email.com",
            "senha": "987654"
        }
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Credenciais inválidas"


def test_login_usuario_inexistente():
    response = client.post(
        "/auth/login",
        json={
            "email": "naoexiste@email.com",
            "senha": "123456"
        }
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Credenciais inválidas"