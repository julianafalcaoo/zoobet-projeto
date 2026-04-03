import "../styles/modal.css";

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
}

interface Props {
  aberto: boolean;
  resultado: ResultadoSorteio | null;
  onClose: () => void;
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

function pegarEmojiDoBicho(grupo: number | null | undefined) {
  if (!grupo) return "🐾";
  return emojiPorGrupo[grupo] ?? "🐾";
}

export default function ModalResultado({ aberto, resultado, onClose }: Props) {
  if (!aberto || !resultado) return null;

  const ganhou = resultado.resultado_usuario?.status === "ganhou";
  const tipoAposta = resultado.resultado_usuario?.tipo;

  return (
    <div className="modal-resultado-overlay" onClick={onClose}>
      <div
        className="modal-resultado"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-resultado-topo">
          <h4 className="mb-0">
            <i className="bi bi-trophy me-2"></i>
            Resultado do Sorteio
          </h4>

          <button className="btn-fechar-modal" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="modal-resultado-conteudo">
          <div className="modal-coluna">
            <div className="modal-resultado-destaque">
              <i className="bi bi-ticket-perforated me-2"></i>
              Sua aposta
            </div>

            {resultado.resultado_usuario ? (
              <>
                <div className="modal-resultado-linha">
                  <span>Tipo da aposta</span>
                  <strong>{resultado.resultado_usuario.tipo}</strong>
                </div>

                <div className="modal-resultado-linha">
                  <span>
                    {tipoAposta === "grupo" ? "Grupo apostado" : "Milhar apostada"}
                  </span>
                 <strong className="resultado-animal">
                  {tipoAposta === "grupo" ? (
                    <>
                      {resultado.resultado_usuario.numero.toString().padStart(2, "0")}
                      <span className="emoji-resultado">
                        {pegarEmojiDoBicho(resultado.resultado_usuario.numero)}
                      </span>
                    </>
                  ) : (
                    resultado.resultado_usuario.numero.toString().padStart(4, "0")
                  )}
                </strong>
                </div>

                <div className="modal-resultado-linha">
                  <span>Valor apostado</span>
                  <strong>
                    R$ {resultado.resultado_usuario.valor.toFixed(2)}
                  </strong>
                </div>

                <div
                  className={`status-aposta-box ${
                    ganhou ? "ganhou" : "perdeu"
                  }`}
                >
                  <div className="status-aposta-titulo">
                    {ganhou ? (
                      <>
                        <i className="bi bi-award-fill me-2"></i>
                        Você ganhou!
                      </>
                    ) : (
                      <>
                        <i className="bi bi-emoji-frown me-2"></i>
                        Você perdeu!
                      </>
                    )}
                  </div>

                  <div className="status-aposta-detalhe">
                    Prêmio: <strong>R$ {resultado.resultado_usuario.premio.toFixed(2)}</strong>
                  </div>

                  {ganhou && (
                    <>
                      <div className="status-aposta-detalhe">
                        Acertou no <strong>{resultado.resultado_usuario.premio_acertado}º prêmio</strong>
                      </div>

                      <div className="status-aposta-detalhe">
                        Milhar sorteada:{" "}
                        <strong>
                          {resultado.resultado_usuario.milhar_acertada
                            ?.toString()
                            .padStart(4, "0")}
                        </strong>
                      </div>

                      <div className="status-aposta-detalhe">
                        Animal sorteado:{" "}
                        <strong className="emoji-resultado">
                          {pegarEmojiDoBicho(resultado.resultado_usuario.grupo_acertado)}{" "}
                          {resultado.resultado_usuario.bicho_acertado}
                        </strong>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="modal-resultado-linha">
                <span>Nenhuma aposta encontrada</span>
                <strong>—</strong>
              </div>
            )}
          </div>

          <div className="modal-coluna">
            <div className="modal-resultado-destaque">
              <i className="bi bi-stars me-2"></i>
              Top 5 resultados sorteados
            </div>

            {resultado.sorteios.map((sorteio) => (
              <div className="modal-resultado-linha" key={sorteio.premio}>
                <span>{sorteio.premio}º prêmio</span>
                <strong className="resultado-animal">
                  {sorteio.milhar.toString().padStart(4, "0")} |{" "}
                  <span className="emoji-resultado">
                    {pegarEmojiDoBicho(sorteio.grupo)}
                  </span>
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}