from sqlalchemy import *
from sqlalchemy.orm import *
from app.core.database import Base
from datetime import datetime

class Aposta(Base):
    __tablename__ = "apostas"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo = Column(String, nullable=False)  #grupo ou milhar
    numero = Column(Integer, nullable=False)
    valor = Column(Float, nullable=False)
    premio = Column(Float, nullable=True, default=0)
    status = Column(String, nullable=True, default=None)  #ganhou ou perdeu
    criacao = Column(DateTime(timezone=True), server_default=func.now())

    resultados = relationship(
        "ResultadoAposta",
        back_populates="aposta",
        cascade="all, delete-orphan"
    )

class ResultadoAposta(Base):
    __tablename__ = "resultados_aposta"

    id = Column(Integer, primary_key=True, index=True)
    aposta_id = Column(Integer, ForeignKey("apostas.id"), nullable=False)
    premio = Column(Integer, nullable=False)
    milhar = Column(Integer, nullable=False)
    grupo = Column(Integer, nullable=False)
    bicho = Column(String(50), nullable=False)
    final = Column(Integer, nullable=False)

    aposta = relationship("Aposta", back_populates="resultados")