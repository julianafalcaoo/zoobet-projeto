import "../styles/comoJogar.css";

export default function ComoJogar() {
  return (
    <div className="container-xl como-jogar-page">
      <div className="como-jogar-topo">
        <h1 className="como-jogar-titulo">Como Jogar</h1>

        <div className="alerta-educativo">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Este protótipo é apenas para fins educativos. O jogo é proibido por lei no Brasil.
        </div>
      </div>

      <section className="card-info">
        <h2 className="secao-titulo">
          <i className="bi bi-scroll me-2"></i>
          História do Jogo do Bicho
        </h2>

        <p>
          O Jogo do Bicho foi criado em 1892 por João Batista Viana Drummond, no Rio de Janeiro.
          Inicialmente, a ideia era atrair visitantes para o zoológico, por meio de bilhetes associados a animais.
          Com o tempo, a prática se popularizou em várias regiões do Brasil.
        </p>
        <p>
          Neste sistema educativo, você pode apostar em <strong>grupo</strong> ou em <strong>milhar</strong>, com a lógica básica de funcionamento do jogo.
        </p>
      </section>

      <section className="passo-a-passo">
        <h2 className="secao-titulo">
          <i className="bi bi-clipboard-check me-2"></i>
          Passo a Passo
        </h2>

        <div className="passos-grid">
          <div className="passo-card">
            <div className="passo-numero">1</div>
            <h3>Escolha o tipo</h3>
            <p>Selecione se deseja apostar em um grupo de animal ou em uma milhar.</p>
          </div>

          <div className="passo-card">
            <div className="passo-numero">2</div>
            <h3>Informe sua aposta</h3>
            <p>
              Escolha o animal desejado ou digite a milhar que deseja apostar.
            </p>
          </div>

          <div className="passo-card">
            <div className="passo-numero">3</div>
            <h3>Defina o valor</h3>
            <p>Informe o valor da aposta, respeitando seu saldo disponível.</p>
          </div>

          <div className="passo-card">
            <div className="passo-numero">4</div>
            <h3>Realize o sorteio</h3>
            <p>
              O sistema sorteia uma milhar e verifica automaticamente se sua aposta venceu.
            </p>
          </div>
        </div>
      </section>

      <section className="modalidades-section">
        <h2 className="secao-titulo">
          <i className="bi bi-bullseye me-2"></i>
          Modalidades de Aposta
        </h2>

        <div className="modalidades-grid">
          <div className="modalidade-card modalidade-bicho">
            <div className="modalidade-topo">
              <div className="modalidade-titulo-bloco">
                <span className="modalidade-icone">
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                </span>
                <h3>Bicho</h3>
              </div>

              <span className="premio-badge premio-verde">18x</span>
            </div>

            <p className="modalidade-descricao">
              Advinhe qual animal será sorteado a partir do grupo correspondente.
            </p>

            <div className="exemplo-box exemplo-verde">
              <i className="bi bi-pin-angle-fill me-2"></i>
              Exemplo: se apostar no grupo do animal correto, você recebe{" "}
              <strong>18 vezes</strong> o valor apostado.
            </div>
          </div>

          <div className="modalidade-card modalidade-milhar">
            <div className="modalidade-topo">
              <div className="modalidade-titulo-bloco">
                <span className="modalidade-icone">
                  <i className="bi bi-crosshair"></i>
                </span>
                <h3>Milhar</h3>
              </div>

              <span className="premio-badge premio-laranja">4000x</span>
            </div>

            <p className="modalidade-descricao">
              Advinhe o número completo de 4 dígitos sorteado pelo sistema.
            </p>

            <div className="exemplo-box exemplo-laranja">
              <i className="bi bi-pin-angle-fill me-2"></i>
              Exemplo: se apostar em <strong>1342</strong> e a milhar sorteada for{" "}
              <strong>1342</strong>, você recebe <strong>4000 vezes</strong> o valor apostado.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}