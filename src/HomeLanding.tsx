import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors, ArrowRight, ShieldCheck } from "lucide-react";

export default function HomeLanding() {
  const [slug, setSlug] = useState("");
  const navigate = useNavigate();

  function handleGoToClient(e: React.FormEvent) {
    e.preventDefault();
    const cleanSlug = slug.trim().toLowerCase();
    if (cleanSlug) {
      navigate(`/b/${cleanSlug}`);
    }
  }

  function handleGoToAdmin() {
    const cleanSlug = slug.trim().toLowerCase() || "demo";
    navigate(`/admin/${cleanSlug}/login`);
  }

  return (
    <div className="min-h-screen bg-[#151310] text-[#e8e1dc] flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md bg-[#211f1c] border border-[#383129] rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-[#c17f3b]/15 text-[#c17f3b] flex items-center justify-center mx-auto mb-5 border border-[#c17f3b]/30 shadow-inner">
          <Scissors className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Barbe Club — Multi-Tenant
        </h1>
        <p className="text-sm text-[#a89a89] mb-6">
          Plataforma de agendamento online e gestão para barbearias.
        </p>

        <form onSubmit={handleGoToClient} className="space-y-4 text-left">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#a89a89] mb-1.5">
              Identificador da Barbearia (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: vintage-club ou barbearia-teste"
              className="w-full bg-[#151310] border border-[#383129] rounded-xl px-4 py-3 text-white placeholder-[#524439] focus:outline-none focus:border-[#c17f3b] transition"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!slug.trim()}
            className="w-full bg-[#c17f3b] hover:bg-[#c5823e] disabled:opacity-40 disabled:hover:bg-[#c17f3b] text-[#191714] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-150 cursor-pointer disabled:cursor-not-allowed shadow-md"
          >
            <span>Acessar Agendamento</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#383129] flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGoToAdmin}
            className="text-xs text-[#a89a89] hover:text-[#c17f3b] flex items-center justify-center gap-1.5 transition py-1 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Painel do Barbeiro / Gestor {slug ? `(${slug})` : ""}</span>
          </button>
        </div>
      </div>

      <p className="mt-8 text-xs text-[#524439] text-center">
        Dica: o acesso direto é feito pela URL: <code>/b/nome-da-barbearia</code>
      </p>
    </div>
  );
}
