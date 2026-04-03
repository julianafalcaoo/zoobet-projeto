import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import ModalPerfil from "./modalPerfil";

interface Props {
  nome: string;
}

export default function Header({ nome }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);

  function abrirModalPerfil() {
    setModalPerfilAberto(true);
    setMenuAberto(false);
  }

  function fecharModalPerfil() {
    setModalPerfilAberto(false);
  }

  function ativo(path: string) {
    return location.pathname === path;
  }

  function sair() {
    localStorage.removeItem("token");
    navigate("/login");
    setMenuAberto(false);
  }

  function irPara(path: string) {
    navigate(path);
    setMenuAberto(false);
  }

  return (
    <>
      <header className="cabecalho-principal">
        <div className="container-fluid cabecalho-conteudo">
          <div className="cabecalho-esquerda">
            <img src="/logo.png" alt="Logo" className="cabecalho-logo" />
          </div>

          <button
            className="menu-mobile-btn"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir menu"
          >
            <i className={`bi ${menuAberto ? "bi-x-lg" : "bi-list"}`}></i>
          </button>

          <div className={`menu-central ${menuAberto ? "aberto" : ""}`}>
            <button
              className={`menu-btn ${ativo("/aposta") ? "ativo" : ""}`}
              onClick={() => irPara("/aposta")}
            >
              <i className="bi bi-controller me-2"></i>
              Apostar
            </button>

            <button
              className={`menu-btn ${ativo("/como-jogar") ? "ativo" : ""}`}
              onClick={() => irPara("/como-jogar")}
            >
              <i className="bi bi-book me-2"></i>
              Como Jogar
            </button>

            <button
              className={`menu-btn ${ativo("/historico") ? "ativo" : ""}`}
              onClick={() => irPara("/historico")}
            >
              <i className="bi bi-clock-history me-2"></i>
              Histórico
            </button>

            <div className="cabecalho-direita mobile-direita">
              <button
                className="cabecalho-badge usuario-badge botao-perfil"
                onClick={abrirModalPerfil}
              >
                <i className="bi bi-person me-2"></i>
                {nome}
              </button>

              <button className="botao-sair" onClick={sair}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Sair
              </button>
            </div>
          </div>

          <div className="cabecalho-direita desktop-direita">
            <button
              className="cabecalho-badge usuario-badge botao-perfil"
              onClick={abrirModalPerfil}
            >
              <i className="bi bi-person me-2"></i>
              {nome}
            </button>

            <button className="botao-sair" onClick={sair}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Sair
            </button>
          </div>
        </div>
      </header>

      <ModalPerfil
        aberto={modalPerfilAberto}
        onClose={fecharModalPerfil}
      />
    </>
  );
}