from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import aposta_service
from app.services import auth_service

from app.schemas.aposta_schema import (
    ApostaCreate,
    ApostaCreateResponse,
    ApostaHistoricoResponse
)

from app.models.usuario import Usuario


router = APIRouter(prefix="/apostas", tags=["Apostas"])


@router.post("/", response_model=ApostaCreateResponse)
def criar_aposta(
    dados: ApostaCreate,
    db: Session = Depends(get_db),
    usuario=Depends(auth_service.get_current_user)
):
    aposta = aposta_service.registrar_aposta(
        db=db,
        usuario=usuario,
        tipo=dados.tipo,
        numero=dados.numero,
        valor=dados.valor
    )

    return aposta


@router.get("/historico", response_model=list[ApostaHistoricoResponse])
def listar_apostas(
    db: Session = Depends(get_db),
    usuario=Depends(auth_service.get_current_user)
):
    return aposta_service.listar_historico_usuario(db, usuario.id)


@router.post("/sortear")
def sortear(
    db: Session = Depends(get_db),
    usuario=Depends(auth_service.get_current_user)
):
    resultado = aposta_service.processar_sorteio(db, usuario)
    return resultado 