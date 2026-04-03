from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.usuario_schema import Token, UsuarioCreate, UsuarioLogin, Deposito, UsuarioUpdate
from app.services import auth_service
from app.models.usuario import Usuario

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/registrar", response_model=Token)
def registrar(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existe = db.query(Usuario).filter(Usuario.email == usuario.email).first()

    if existe:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    novo = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        cpf=usuario.cpf,
        senha=auth_service.gerar_hash(usuario.senha)
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)

    token = auth_service.criar_token({"sub": novo.email})

    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(dados: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()

    if not usuario or not auth_service.verificar_senha(dados.senha, usuario.senha):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = auth_service.criar_token({"sub": usuario.email})

    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def me(usuario=Depends(auth_service.get_current_user)):
    return {
        "nome": usuario.nome,
        "email": usuario.email,
        "saldo": usuario.saldo,
        "foto": usuario.foto,
        "cpf": usuario.cpf,
    }


@router.put("/perfil")
def atualizar_perfil(
    dados: UsuarioUpdate,
    db: Session = Depends(get_db),
    usuario=Depends(auth_service.get_current_user)
):
    usuario.nome = dados.nome
    usuario.email = dados.email

    if dados.senha:
        usuario.senha = auth_service.gerar_hash(dados.senha)

    db.commit()
    db.refresh(usuario)

    return {
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email
    }


@router.post("/depositar")
def simular_deposito(
    dados: Deposito,
    db: Session = Depends(get_db),
    usuario=Depends(auth_service.get_current_user)
):
    if dados.valor <= 0:
        raise HTTPException(status_code=400)

    usuario.saldo += dados.valor
    db.commit()
    db.refresh(usuario)

    return {
        "msg": "Deposito realizado com sucesso",
        "saldo_atual": usuario.saldo
    }