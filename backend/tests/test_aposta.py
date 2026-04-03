from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def criar_usuario_e_token(email):
    client.post(
        "/auth/registrar",
        json={
            "nome": "Teste",
            "email": email,
            "senha": "123456",
            "cpf": "12345678900"
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": email,
            "senha": "123456"
        }
    )

    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


## cenario de aposta criada com sucesso

def test_criar_aposta_grupo():
    headers = criar_usuario_e_token("apostagrupo@email.com")

    response = client.post(
        "/apostas/",
        json={
            "tipo": "grupo",
            "numero": 5,
            "valor": 50
        },
        headers=headers
    )

    assert response.status_code == 200
    data = response.json()

    assert "aposta" in data
    assert data["aposta"]["tipo"] == "grupo"
    assert data["saldo_atual"] == 800


def test_criar_aposta_milhar():
    headers = criar_usuario_e_token("apostamilhar@email.com")

    response = client.post(
        "/apostas/",
        json={
            "tipo": "milhar",
            "numero": 5555,
            "valor": 100
        },
        headers=headers
    )

    assert response.status_code == 200
    data = response.json()

    assert "aposta" in data
    assert data["aposta"]["tipo"] == "milhar"
    assert data["saldo_atual"] == 600


##cenarios aposta sem sucesso

def test_aposta_saldo_insuficiente():
    headers = criar_usuario_e_token("aposta2@email.com")

    response = client.post(
        "/apostas/",
        json={
            "tipo": "grupo",
            "numero": 5,
            "valor": 2000
        },
        headers=headers
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Saldo insuficiente"

def test_aposta_milhar_invalida():
    headers = criar_usuario_e_token("aposta4@email.com")

    response = client.post(
        "/apostas/",
        json={
            "tipo": "milhar",
            "numero": 10000,
            "valor": 10
        },
        headers=headers
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Milhar inválida"
##

def test_listar_historico():
    headers = criar_usuario_e_token("aposta5@email.com")

    client.post(
        "/apostas/",
        json={
            "tipo": "grupo",
            "numero": 5,
            "valor": 20
        },
        headers=headers
    )

    response = client.get(
        "/apostas/historico",
        headers=headers
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


def test_sortear_apostas():
    headers = criar_usuario_e_token("aposta6@email.com")

    client.post(
        "/apostas/",
        json={
            "tipo": "grupo",
            "numero": 5,
            "valor": 10
        },
        headers=headers
    )

    response = client.post(
        "/apostas/sortear",
        headers=headers
    )

    assert response.status_code == 200
    data = response.json()

    assert "sorteios" in data
    assert len(data["sorteios"]) == 5
    assert "saldo_atual" in data