import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import "./barber-portal.css";

function mensagemDeErro(codigo: string): string {
  switch (codigo) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde um pouco e tente de novo.";
    default:
      return "Não foi possível entrar. Tente novamente.";
  }
}

export default function BarberLogin() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      navigate(`/admin/${tenantSlug}`);
    } catch (err) {
      setError(mensagemDeErro((err as { code?: string }).code ?? ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="barber-portal">
      <form className="barber-login-card" onSubmit={handleSubmit}>
        <h1>Acesso da barbearia</h1>
        <p className="step__subtitle">Entre com o e-mail cadastrado pela gestão.</p>

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <span className="field-error">{error}</span>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
