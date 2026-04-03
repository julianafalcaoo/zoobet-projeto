import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/modalPerfil.css";

interface Props {
  aberto: boolean;
  onClose: () => void;
}

export default function ModalPerfil({ aberto, onClose }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState("");
  const [cpf, setCpf] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (aberto) {
      carregarPerfil();
    }
  }, [aberto]);

  async function carregarPerfil() {
    try {
      const res = await api.get("/auth/me");
      setNome(res.data.nome || "");
      setEmail(res.data.email || "");
      setFoto(res.data.foto || "");
      setCpf(res.data.cpf || "");
    } catch (err) {
      console.error("Erro ao carregar perfil", err);
    }
  }

  function handleFotoLocal(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFoto(reader.result);
      }
    };

    reader.readAsDataURL(arquivo);
  }

  async function salvarPerfil(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSalvando(true);

      await api.put("/auth/perfil", {
        nome,
        email,
        foto,
      });

      alert("Perfil atualizado com sucesso!");
      onClose();
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Erro ao atualizar perfil.");
    } finally {
      setSalvando(false);
    }
  }

  if (!aberto) return null;

  return (
    <div className="modal-perfil-overlay" onClick={onClose}>
      <div className="modal-perfil" onClick={(e) => e.stopPropagation()}>
        <div className="modal-perfil-topo">
          <h4 className="mb-0">
            <i className="bi bi-person-circle me-2"></i>
            Editar Perfil
          </h4>

          <button
            type="button"
            className="btn-fechar-modal-perfil"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={salvarPerfil} className="modal-perfil-form">
          <div className="perfil-conteudo-lado-a-lado">
            <div className="perfil-foto-box">
              <div className="perfil-preview">
                {foto ? (
                  <img src={foto} alt="Foto de perfil" className="perfil-img" />
                ) : (
                  <div className="perfil-placeholder">
                    <i className="bi bi-person-fill"></i>
                  </div>
                )}
              </div>

              <label className="btn btn-outline-success botao-foto">
                <i className="bi bi-image me-2"></i>
                Escolher foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoLocal}
                  hidden
                />
              </label>
            </div>

            <div className="perfil-campos">
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite seu nome"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">CPF</label>
                <input
                  type="text"
                  className="form-control"
                  value={cpf}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="modal-perfil-acoes">
            <button
              type="submit"
              className="btn btn-success botao-perfil-acao"
              disabled={salvando}
            >
              <i className="bi bi-check-circle me-2"></i>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}