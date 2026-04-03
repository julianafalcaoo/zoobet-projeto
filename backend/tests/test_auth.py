from backend.app.services.auth_service import gerar_hash, verificar_senha, criar_token

def test_hash_senha():
    senha = "123456"
    hash_senha = gerar_hash(senha)

    assert verificar_senha(senha, hash_senha) is True

def test_hash_senha_errada():
    senha = "123456"
    hash_senha = gerar_hash(senha)

    assert verificar_senha("142536", hash_senha) is False


def test_criar_token():
    pass