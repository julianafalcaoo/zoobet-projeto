import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/header";
import api from "../services/api";
import "../styles/header.css";

import Footer from "../components/footer";
import "../styles/footer.css";
import "../styles/layout.css";

interface UsuarioLogado {
  id: number;
  nome: string;
  saldo: number;
}

export default function Layout() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    buscarUsuario();
  }, []);

  async function buscarUsuario() {
    try {
      const response = await api.get("/auth/me");
      setUsuario(response.data);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  return (
    <div className="layout">
      <Header nome={usuario?.nome ?? "Usuário"} />

      <main className="conteudo-principal">
        <Outlet context={{ usuario, atualizarUsuario: buscarUsuario }} />
      </main>

      <Footer />
    </div>
  );
}