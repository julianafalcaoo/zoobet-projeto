from fastapi import APIRouter
from app.services.bicho_service import listar_bichos

router = APIRouter(prefix="/animais", tags=["Animais"])

@router.get("/")
def get_animais():
    return listar_bichos()