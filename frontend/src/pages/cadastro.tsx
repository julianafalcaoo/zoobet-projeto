import "../styles/auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Cadastro() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cpf, setCpf] = useState("");

  const senhasIguais = senha === confirmarSenha;

  const handleCadastro = async () => {
    if (!senhasIguais) return;

    try {
      const response = await api.post("/auth/registrar", {
        nome,
        email,
        senha,
        cpf,
      });

      console.log(response.data);

      alert("Conta criada com sucesso");
      navigate("/login");

    } catch (error: any) {
      console.error(error);
      alert("Erro ao cadastrar");
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center">
      <div className="login-card">

        <div className="login-header text-center">
          <img src="/logo.png" alt="Logo" className="logo mb-2" />
        </div>

        <div className="login-body">
          <h5 className="fw-bold mb-1">Criar sua conta</h5>
          <p className="text-muted small mb-4">
            Junte-se ao ZOOBET!
          </p>

          <label className="form-label small fw-bold">NOME COMPLETO</label>
          <div className="input-group mb-3 custom-input">
            <span className="input-group-text">
              <i className="bi bi-person"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <label className="form-label small fw-bold">CPF</label>
            <div className="input-group mb-3 custom-input">
              <span className="input-group-text">
                <i className="bi bi-card-text"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

          <label className="form-label small fw-bold">E-MAIL</label>
          <div className="input-group mb-3 custom-input">
            <span className="input-group-text">
              <i className="bi bi-envelope"></i>
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label className="form-label small fw-bold">SENHA</label>
          <div className="input-group mb-3 custom-input">
            <span className="input-group-text">
              <i className="bi bi-lock"></i>
            </span>
            <input
              type={show ? "text" : "password"}
              className="form-control"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShow(!show)}
            >
              <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>

          <label className="form-label small fw-bold">CONFIRMAR SENHA</label>
          <div className="input-group mb-2 custom-input">
            <span className="input-group-text">
              <i className="bi bi-lock"></i>
            </span>
            <input
              type={show ? "text" : "password"}
              className={`form-control ${
                confirmarSenha && !senhasIguais ? "is-invalid" : ""
              }`}
              placeholder="••••••••"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>

          {!senhasIguais && confirmarSenha && (
            <div className="text-danger small mb-3">
              As senhas não coincidem
            </div>
          )}

          <button
            onClick={handleCadastro}
            className="btn btn-success w-100 fw-semibold login-btn"
            disabled={!nome || !cpf || !email || !senha || !confirmarSenha || !senhasIguais}
          >
            → Criar conta
          </button>

          <p className="text-center small text-muted mt-4">
            Já tem uma conta?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Entrar
            </span>
          </p>
        </div>

        <div className="login-footer text-center">
          © 2026 ZOOBET — Fins educativos
        </div>
      </div>
    </div>
  );
}

