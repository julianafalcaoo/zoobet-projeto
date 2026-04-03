from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from app.models.usuario import Usuario
from app.models.aposta import Aposta
from app.models.aposta import ResultadoAposta
from app.services.bicho_service import descobrir_grupo, sortear_milhar


def validar_saldo(usuario, valor):
    if usuario.saldo < valor:
        raise HTTPException(
            status_code=400,
            detail="Saldo insuficiente"
        )


def validar_aposta(tipo, numero, valor):
    if tipo == "grupo":
        if numero < 1 or numero > 25:
            raise HTTPException(status_code=400, detail="Grupo inválido")

    elif tipo == "milhar":
        if numero < 0 or numero > 9999:
            raise HTTPException(status_code=400, detail="Milhar inválida")

    else:
        raise HTTPException(status_code=400, detail="Tipo de aposta inválido")


def registrar_aposta(db: Session, usuario, tipo, numero, valor):
    validar_aposta(tipo, numero, valor)
    validar_saldo(usuario, valor)

    try:
        usuario_db = db.query(Usuario).filter(
            Usuario.id == usuario.id
        ).first()

        if not usuario_db:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        aposta = Aposta(
            usuario_id=usuario.id,
            tipo=tipo,
            numero=numero,
            valor=valor,
            status=None,
            premio=0
        )

        usuario_db.saldo -= valor

        db.add(aposta)
        db.commit()
        db.refresh(aposta)
        db.refresh(usuario_db)

        return {"aposta": aposta, "saldo_atual": usuario_db.saldo}

    except Exception as e:
        db.rollback()
        raise e


def gerar_cinco_sorteios():
    sorteios = []
    milhares_sorteadas = set()

    while len(sorteios) < 5:
        milhar = sortear_milhar()

        if milhar in milhares_sorteadas:
            continue

        milhares_sorteadas.add(milhar)

        resultado = descobrir_grupo(milhar)

        sorteios.append({
            "premio": len(sorteios) + 1,
            "milhar": milhar,
            "grupo": resultado["grupo"],
            "bicho": resultado["bicho"],
            "final": resultado["final"]
        })

    return sorteios


def calcular_premio(aposta, sorteio):
    posicao = sorteio["premio"]

    multiplicadores_milhar = {
        1: 4000,
        2: 2000,
        3: 1000,
        4: 500,
        5: 500
    }

    multiplicadores_grupo = {
        1: 18,
        2: 16,
        3: 15,
        4: 13,
        5: 13
    }

    if aposta.tipo == "milhar":
        if aposta.numero == sorteio["milhar"]:
            return aposta.valor * multiplicadores_milhar[posicao]

    if aposta.tipo == "grupo":
        if aposta.numero == sorteio["grupo"]:
            return aposta.valor * multiplicadores_grupo[posicao]

    return 0


def processar_sorteio(db: Session, usuario_logado):
    sorteios = gerar_cinco_sorteios()

    try:
        apostas = db.query(Aposta).filter(
            Aposta.usuario_id == usuario_logado.id,
            Aposta.status == None
        ).all()

        usuario_db = db.query(Usuario).filter(
            Usuario.id == usuario_logado.id
        ).first()

        if not usuario_db:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        resultado_usuario = None

        for aposta in apostas:
            for sorteio in sorteios:
                resultado_db = ResultadoAposta(
                    aposta_id=aposta.id,
                    premio=sorteio["premio"],
                    milhar=sorteio["milhar"],
                    grupo=sorteio["grupo"],
                    bicho=sorteio["bicho"],
                    final=sorteio["final"]
                )
                db.add(resultado_db)

            melhor_premio = 0
            melhor_sorteio = None

            for sorteio in sorteios:
                premio = calcular_premio(aposta, sorteio)

                if premio > melhor_premio:
                    melhor_premio = premio
                    melhor_sorteio = sorteio

            if melhor_premio > 0:
                usuario_db.saldo += melhor_premio
                aposta.premio = melhor_premio
                aposta.status = "ganhou"
            else:
                aposta.premio = 0
                aposta.status = "perdeu"

            if aposta.usuario_id == usuario_logado.id and resultado_usuario is None:
                resultado_usuario = {
                    "aposta_id": aposta.id,
                    "tipo": aposta.tipo,
                    "numero": aposta.numero,
                    "valor": aposta.valor,
                    "status": aposta.status,
                    "premio": aposta.premio,
                    "premio_acertado": melhor_sorteio["premio"] if melhor_sorteio else None,
                    "milhar_acertada": melhor_sorteio["milhar"] if melhor_sorteio else None,
                    "grupo_acertado": melhor_sorteio["grupo"] if melhor_sorteio else None,
                    "bicho_acertado": melhor_sorteio["bicho"] if melhor_sorteio else None,
                }

        db.commit()
        db.refresh(usuario_db)

    except Exception as e:
        db.rollback()
        print("ERRO NO SORTEIO:", repr(e))
        raise e

    return {
        "sorteios": sorteios,
        "resultado_usuario": resultado_usuario,
        "saldo_atual": usuario_db.saldo
    }


def listar_historico_usuario(db: Session, usuario_id: int):
    apostas = (
        db.query(Aposta)
        .options(joinedload(Aposta.resultados))
        .filter(Aposta.usuario_id == usuario_id)
        .order_by(Aposta.criacao.desc(), Aposta.id.desc())
        .all()
    )

    historico = []

    for aposta in apostas:
        historico.append({
            "id": aposta.id,
            "tipo": aposta.tipo,
            "numero": aposta.numero,
            "valor": aposta.valor,
            "status": aposta.status,
            "premio": aposta.premio,
            "criacao": aposta.criacao,
            "sorteios": [
                {
                    "premio": r.premio,
                    "milhar": r.milhar,
                    "grupo": r.grupo,
                    "bicho": r.bicho,
                    "final": r.final
                }
                for r in sorted(aposta.resultados, key=lambda x: x.premio)
            ]
        })

    return historico