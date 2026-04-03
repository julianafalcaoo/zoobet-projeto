from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_online():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json () == {"msg": "API funcionando"}