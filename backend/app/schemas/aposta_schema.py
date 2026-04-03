from pydantic import *
from typing import *
from datetime import datetime

class ApostaCreate(BaseModel):
    tipo: str 
    numero: int
    valor: float
    
    @field_validator("valor")
    def validar_valor(cls, v):
        if v<0:
            raise ValueError ("Valor deve ser maior que 0")
        return v

class ApostaResponse(BaseModel):
    id: int
    tipo: str
    numero: int
    valor: float
    status: str | None
    premio: float

    class Config:
        orm_mode = True

class  ApostaCreateResponse (BaseModel):
    aposta: ApostaResponse
    saldo_atual: float

class SorteioHistoricoResponse(BaseModel):
    premio: int
    milhar: int
    grupo: int
    bicho: str
    final: int

    class Config:
        orm_mode = True


class ApostaHistoricoResponse(BaseModel):
    id: int
    tipo: str
    numero: int
    valor: float
    status: str | None
    premio: float
    criacao: datetime | None = None
    sorteios: list[SorteioHistoricoResponse] = []

    class Config:
        orm_mode = True
