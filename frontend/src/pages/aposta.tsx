import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "../styles/aposta.css";
import ModalResultado from "../components/modalResultado";

interface Animal {
  id: number;
  nome: string;
  grupo: number;
  numeros: number[];
}

interface ResultadoUsuario {
  aposta_id: number;
  tipo: string;
  numero: number;
  valor: number;
  status: string;
  premio: number;
  premio_acertado: number | null;
  milhar_acertada: number | null;
  grupo_acertado: number | null;
  bicho_acertado: string | null;
}

interface SorteioItem {
  premio: number;
  milhar: number;
  grupo: number;
  bicho: string;
  final: number;
}

interface ResultadoSorteio {
  sorteios: SorteioItem[];
  resultado_usuario: ResultadoUsuario | null;
  saldo_atual: number;
}

const emojiPorGrupo: Record<number, string> = {
  1: "🦤",
  2: "🦅",
  3: "🫏",
  4: "🦋",
  5: "🐶",
  6: "🐐",
  7: "🐑",
  8: "🐪",
  9: "🐍",
  10: "🐇",
  11: "🐎",
  12: "🐘",
  13: "🐓",
  14: "🐱",
  15: "🐊",
  16: "🦁",
  17: "🐒",
  18: "🐷",
  19: "🦚",
  20: "🦃",
  21: "🐂",
  22: "🐯",
  23: "🐻",
  24: "🦌",
  25: "🐄",
};

export default function Aposta() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(null);
  const [tipo, setTipo] = useState<"grupo" | "milhar">("grupo");
  const [valor, setValor] = useState("");
  const [milhar, setMilhar] = useState("");
  const [carregandoAposta, setCarregandoAposta] = useState(false);
  const [resultadoSorteio, setResultadoSorteio] = useState<ResultadoSorteio | null>(null);
  const [saldo, setSaldo] = useState<number>(0);

  const [modalDepositoAberto, setModalDepositoAberto] = useState(false);
  const [valorDeposito, setValorDeposito] = useState("");
  const [depositando, setDepositando] = useState(false);

  useEffect(() => {
    carregarAnimais();
    carregarSaldo();
  }, []);

  useEffect(() => {
    if (tipo === "grupo") {
      setMilhar("");
    } else {
      setAnimalSelecionado(null);
    }
  }, [tipo]);

  async function carregarAnimais() {
    try {
      const res = await api.get("/animais");
      setAnimais(res.data);
    } catch (err) {
      console.error("Erro ao carregar animais", err);
    }
  }

  async function carregarSaldo() {
    try {
      const res = await api.get("/auth/me");
      setSaldo(res.data.saldo ?? 0);
    } catch (err) {
      console.error("Erro ao carregar saldo", err);
    }
  }

  const premioPotencial = useMemo(() => {
    const valorNumero = Number(valor);

    if (!valor || valorNumero <= 0) {
      return 0;
    }

    return tipo === "grupo" ? valorNumero * 18 : valorNumero * 4000;
  }, [tipo, valor]);

  async function simularDeposito() {
    const valorNumero = Number(valorDeposito);

    if (!valorDeposito || Number.isNaN(valorNumero) || valorNumero <= 0) {
      alert("Digite um valor de depósito válido.");
      return;
    }

    try {
      setDepositando(true);

      const res = await api.post("/auth/depositar", {
        valor: valorNumero,
      });

      setSaldo(res.data.saldo ?? res.data.saldo_atual ?? 0);
      setValorDeposito("");
      setModalDepositoAberto(false);
      alert("Depósito feito com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Erro ao depositar.");
    } finally {
      setDepositando(false);
    }
  }

  async function apostarESortear() {
    if (!valor || Number(valor) <= 0) {
      alert("Digite um valor válido.");
      return;
    }

    let numeroAposta: number;

    if (tipo === "grupo") {
      if (!animalSelecionado) {
        alert("Selecione um animal.");
        return;
      }

      numeroAposta = animalSelecionado.grupo;
    } else {
      if (!milhar.trim()) {
        alert("Digite a milhar.");
        return;
      }

      const milharNumero = Number(milhar);

      if (Number.isNaN(milharNumero) || milharNumero < 0 || milharNumero > 9999) {
        alert("Digite uma milhar válida entre 0000 e 9999.");
        return;
      }

      numeroAposta = milharNumero;
    }

    try {
      setCarregandoAposta(true);

      const apostaRes = await api.post("/apostas/", {
        tipo,
        numero: numeroAposta,
        valor: Number(valor),
      });

      setSaldo(apostaRes.data.saldo_atual ?? saldo);

      const res = await api.post("/apostas/sortear");
      setResultadoSorteio(res.data);
      setSaldo(res.data.saldo_atual ?? saldo);

      setValor("");
      setMilhar("");
      setAnimalSelecionado(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Erro na aposta.");
    } finally {
      setCarregandoAposta(false);
    }
  }

  return (
    <div className="container-xl aposta-page">
      <div className="card-custom">
        <h4 className="titulo">
          <i className="bi bi-magic me-2"></i>
          Fazer Aposta
        </h4>

        <div className="topo-aposta mb-4">
          <div className="tipo-aposta-box">
            <label className="form-label mb-2">Tipo da aposta</label>

            <div className="d-flex gap-2 flex-wrap">
              <button
                type="button"
                className={`btn ${tipo === "grupo" ? "btn-success" : "btn-outline-primary"}`}
                onClick={() => setTipo("grupo")}
              >
                <i className="bi bi-controller me-2"></i>
                Grupo
              </button>

              <button
                type="button"
                className={`btn ${tipo === "milhar" ? "btn-success" : "btn-outline-primary"}`}
                onClick={() => setTipo("milhar")}
              >
                <i className="bi bi-controller me-2"></i>
                Milhar
              </button>
            </div>
          </div>

          <div className="saldo-box">
            <span className="saldo-texto">
              Saldo atual: <strong>R$ {saldo.toFixed(2)}</strong>
            </span>

            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => setModalDepositoAberto(true)}
            >
              + Depositar
            </button>
          </div>
        </div>

        {tipo === "grupo" && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h5 className="subtitulo-card mb-0">
                <i className="bi bi-grid me-2"></i>
                Escolha o Bicho
              </h5>

              {animalSelecionado && (
                <div className="selecionado-info">
                  Selecionado: <strong>{animalSelecionado.nome}</strong>
                </div>
              )}
            </div>

            <div className="grid-animais">
              {animais.map((animal) => {
                const ativo = animalSelecionado?.id === animal.id;

                return (
                  <div
                    key={animal.id}
                    className={`animal-card ${ativo ? "ativo" : ""}`}
                    onClick={() => setAnimalSelecionado(animal)}
                  >
                    <div className="animal-icone">
                      {emojiPorGrupo[animal.grupo] ?? "🐾"}
                    </div>

                    <div className="nome">{animal.nome}</div>

                    <div className="numeros">
                      {animal.numeros.map((n) => (
                        <span key={n} className="numero-badge">
                          {n.toString().padStart(2, "0")}
                        </span>
                      ))}
                    </div>

                    <div className="grupo">
                      Grupo {animal.grupo.toString().padStart(2, "0")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tipo === "milhar" && (
          <div className="mb-4">
            <label className="form-label">Digite a milhar</label>
            <input
              type="number"
              min="0"
              max="9999"
              className="form-control"
              value={milhar}
              onChange={(e) => setMilhar(e.target.value.slice(0, 4))}
              placeholder="Ex: 1234"
            />
            <small className="text-muted">
              Digite um número entre 0000 e 9999.
            </small>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Valor da aposta</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            className="form-control"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Digite o valor da aposta"
          />
        </div>

        <div className="premio-potencial-box mb-4">
          <span className="premio-label">
            <i className="bi bi-cash-coin me-2"></i>
            Prêmio potencial
          </span>

          <strong className="premio-valor">
            R$ {premioPotencial.toFixed(2)}
          </strong>
        </div>

        <div className="acoes-aposta">
          <button
            type="button"
            className="btn btn-success botao-acao"
            onClick={apostarESortear}
            disabled={carregandoAposta}
          >
            <i className="bi bi-lightning-charge me-2"></i>
            {carregandoAposta ? "Processando..." : "Apostar e Sortear"}
          </button>
        </div>
      </div>

      {modalDepositoAberto && (
        <div
          className="modal-deposito-overlay"
          onClick={() => setModalDepositoAberto(false)}
        >
          <div
            className="modal-deposito"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-deposito-topo">
              <h5 className="mb-0">
                <i className="bi bi-wallet2 me-2"></i>
                Depositar
              </h5>

              <button
                type="button"
                className="btn-fechar-modal"
                onClick={() => setModalDepositoAberto(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-deposito-corpo">
              <label className="form-label">Valor do depósito</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="form-control"
                placeholder="Digite o valor"
                value={valorDeposito}
                onChange={(e) => setValorDeposito(e.target.value)}
              />
            </div>

            <div className="modal-deposito-acoes">
              <button
                type="button"
                className="btn btn-success"
                onClick={simularDeposito}
                disabled={depositando}
              >
                {depositando ? "Processando..." : "Confirmar depósito"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalResultado
        aberto={!!resultadoSorteio}
        resultado={resultadoSorteio}
        onClose={() => setResultadoSorteio(null)}
      />
    </div>
  );
}