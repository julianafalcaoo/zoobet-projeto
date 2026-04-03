import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "../styles/historico.css";

interface Aposta {
  id: number;
  tipo: "grupo" | "milhar";
  numero: number;
  valor: number;
  status: "ganhou" | "perdeu" | null;
  premio: number;
}

type Filtro = "todas" | "ganhou" | "perdeu";

export default function Historico() {
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    try {
      const res = await api.get("/apostas/historico");
      setApostas(res.data);
    } catch (err) {
      console.error("Erro ao carregar histórico", err);
    } finally {
      setCarregando(false);
    }
  }

  const apostasFiltradas = useMemo(() => {
    if (filtro === "todas") return apostas;
    return apostas.filter((a) => a.status === filtro);
  }, [apostas, filtro]);

  const totalApostado = useMemo(() => {
    return apostas.reduce((acc, a) => acc + Number(a.valor ?? 0), 0);
  }, [apostas]);

  const totalGanho = useMemo(() => {
    return apostas
      .filter((a) => a.status === "ganhou")
      .reduce((acc, a) => acc + Number(a.premio ?? 0), 0);
  }, [apostas]);

  const resultadoLiquido = totalGanho - totalApostado;

  const totalGanhas = apostas.filter((a) => a.status === "ganhou").length;
  const totalPerdidas = apostas.filter((a) => a.status === "perdeu").length;

  function formatarStatus(status: Aposta["status"]) {
    if (status === "ganhou") return "Ganhou";
    return "Perdeu";
  }

  function formatarNumero(aposta: Aposta) {
    if (aposta.tipo === "milhar") {
      return aposta.numero.toString().padStart(4, "0");
    }
    return aposta.numero.toString().padStart(2, "0");
  }

  if (carregando) {
    return (
      <div className="container-xl historico-page">
        <p className="text-center mt-4">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="container-xl historico-page">
      <div className="historico-topo">
        <h1 className="historico-titulo">Histórico de Apostas</h1>
        <p className="historico-subtitulo">
          Acompanhe todas as suas apostas e resultados
        </p>
      </div>

      <div className="resumo-grid">
        <div className="resumo-card">
          <span className="resumo-label">Total apostado</span>
          <strong className="resumo-valor">
            R$ {totalApostado.toFixed(2)}
          </strong>
        </div>

        <div className="resumo-card resumo-card-verde">
          <span className="resumo-label">Total ganho</span>
          <strong className="resumo-valor verde">
            R$ {totalGanho.toFixed(2)}
          </strong>
        </div>

        <div className="resumo-card resumo-card-verde">
          <span className="resumo-label">Resultado líquido</span>
          <strong className="resumo-valor verde">
            {resultadoLiquido >= 0 ? "+" : "-"}R$ {Math.abs(resultadoLiquido).toFixed(2)}
          </strong>
        </div>

        <div className="resumo-card">
          <span className="resumo-label">Total de apostas</span>
          <strong className="resumo-valor">{apostas.length}</strong>
        </div>
      </div>

      <div className="filtros-barra">
        <button
          className={`filtro-btn ${filtro === "todas" ? "ativo" : ""}`}
          onClick={() => setFiltro("todas")}
        >
          Todas ({apostas.length})
        </button>

        <button
          className={`filtro-btn ${filtro === "ganhou" ? "ativo" : ""}`}
          onClick={() => setFiltro("ganhou")}
        >
          Ganhas ({totalGanhas})
        </button>

        <button
          className={`filtro-btn ${filtro === "perdeu" ? "ativo" : ""}`}
          onClick={() => setFiltro("perdeu")}
        >
          Perdidas ({totalPerdidas})
        </button>
      </div>

      {apostasFiltradas.length === 0 ? (
        <div className="historico-vazio">
          <div className="vazio-icone">📋</div>
          <p>Nenhuma aposta registrada ainda.</p>
        </div>
      ) : (
        <div className="historico-lista">
          {apostasFiltradas.map((aposta) => (
            <div key={aposta.id} className="aposta-item">
              <div className="aposta-item-esquerda">
                <strong className="aposta-tipo">
                  {aposta.tipo === "grupo" ? "Grupo" : "Milhar"}
                </strong>
                <p className="aposta-info">
                  Número: {formatarNumero(aposta)}
                </p>
              </div>

              <div className="aposta-item-direita">
                <p className="aposta-info">
                  Valor: <strong>R$ {Number(aposta.valor ?? 0).toFixed(2)}</strong>
                </p>
                <p className="aposta-info">
                  Status: <strong>{formatarStatus(aposta.status)}</strong>
                </p>
                <p className="aposta-info">
                  Prêmio: <strong>R$ {Number(aposta.premio ?? 0).toFixed(2)}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}