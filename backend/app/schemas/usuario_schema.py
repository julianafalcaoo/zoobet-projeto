from pydantic import *
from typing import *
from datetime import datetime

class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    cpf: str

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UsuarioUpdate(BaseModel):
    nome: str
    email: EmailStr
    senha: str | None = None
    foto: str | None = None
    cpf: str | None = None

class Deposito (BaseModel):
    valor: float