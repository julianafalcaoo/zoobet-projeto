import "../styles/auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      const token = response.data.access_token;

      localStorage.setItem("token", token);

      alert("Login realizado com sucesso");
      navigate("/aposta");

    } catch (error: any) {
      console.error(error);
      alert("Email ou senha inválidos");
    }
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center">
      <div className="login-card">

        <div className="login-header text-center">
          <img src="/logo.png" alt="Logo" className="logo mb-2" />
        </div>

        <div className="login-body">
          <h5 className="fw-bold mb-1">Entrar na sua conta</h5>
          <p className="text-muted small mb-4">
            Bem-vindo de volta! Faça login para continuar.
          </p>

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
            />
          </div>

          <label className="form-label small fw-bold">SENHA</label>
          <div className="input-group mb-4 custom-input">
            <span className="input-group-text">
              <i className="bi bi-lock"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className="btn btn-success w-100 fw-semibold login-btn"
            disabled={!email || !senha}
          >
            → Entrar
          </button>

          <p className="text-center small text-muted mt-4">
            Não tem uma conta?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/cadastro")}
            >
              Cadastre-se grátis
            </span>
          </p>

          <p className="text-center small text-muted mt-4">
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}>
              Esqueci minha senha
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