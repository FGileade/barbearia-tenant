import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail, LogIn } from "lucide-react";
import { auth } from "../../lib/firebase";
import PasswordInput from "../../components/PasswordInput";

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

// tenantSlug e homePath vêm do App.tsx: em deploy de barbearia única (env
// VITE_TENANT_SLUG) não há slug na URL, então não dá pra ler via useParams.
export default function BarberLogin({
  tenantSlug,
  homePath,
}: {
  tenantSlug: string;
  homePath: string;
}) {
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
      navigate(homePath);
    } catch (err) {
      setError(mensagemDeErro((err as { code?: string }).code ?? ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <img
            src="/logo.svg"
            alt="Logo Barbearia"
            className="w-14 h-14 object-contain rounded-xl p-1 bg-surface-container border border-[#383129] shadow-md"
          />
          <div>
            <span className="font-label-caps text-primary tracking-widest text-xs">
              PAINEL OPERACIONAL
            </span>
            <h1 className="text-xl font-bold text-on-surface tracking-tight mt-0.5">
              Acesso da Barbearia
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Barbearia: <span className="font-semibold text-on-surface">{tenantSlug}</span>
            </p>
          </div>
        </div>

        {/* Card Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container p-6 rounded-2xl border border-[#383129] flex flex-col gap-4 shadow-xl"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="font-label-caps text-on-surface-variant text-[11px] tracking-wider flex items-center gap-1.5"
            >
              <Mail size={13} className="text-primary" /> E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="barbeiro@exemplo.com"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              className="w-full bg-surface text-on-surface placeholder-[#6C6255] border border-[#383129] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg px-3.5 py-2.5 text-sm transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="senha"
              className="font-label-caps text-on-surface-variant text-[11px] tracking-wider flex items-center gap-1.5"
            >
              <Lock size={13} className="text-primary" /> Senha
            </label>
            <PasswordInput
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full bg-surface text-on-surface placeholder-[#6C6255] border border-[#383129] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg px-3.5 py-2.5 text-sm transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error-container/20 border border-error/30 text-[#ffb4ab] text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-primary hover:bg-[#d4934e] active:bg-[#9e6328] text-[#191714] font-bold text-sm py-3 rounded-xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn size={16} />
            {loading ? "Entrando..." : "Entrar no Painel"}
          </button>
        </form>
      </div>
    </div>
  );
}
