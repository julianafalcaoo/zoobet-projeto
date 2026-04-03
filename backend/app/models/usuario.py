from sqlalchemy import *
from sqlalchemy.orm import *
from app.core.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    foto = Column (String, nullable=True)
    cpf = Column (String, nullable=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    senha = Column(String (100), nullable=False)
    saldo = Column(Float, default=1000.0, nullable=False)

