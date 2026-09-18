import { useEffect, useState } from "react";
import { BookOpen, X } from "lucide-react";
import { versiculoDoDia } from "../lib/versiculos";

// Mesma chave da skill versiculo-do-dia: guarda a data (toDateString) em que o
// usuário fechou o banner, para exibir só uma vez por dia.
const STORAGE_KEY = "versiculo-do-dia-fechado";
const AUTO_CLOSE_MS = 20_000;

function jaFechouHoje(hoje: string): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === hoje;
  } catch {
    return false;
  }
}

export default function VersiculoDoDia() {
  const hoje = new Date().toDateString();
  const [visivel, setVisivel] = useState(() => !jaFechouHoje(hoje));

  function fechar() {
    setVisivel(false);
    try {
      localStorage.setItem(STORAGE_KEY, hoje);
    } catch {
      // sem localStorage (modo privado): só não lembra do fechamento
    }
  }

  useEffect(() => {
    if (!visivel) return;
    const timer = setTimeout(fechar, AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visivel]);

  if (!visivel) return null;

  const { texto, ref } = versiculoDoDia();

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed z-50 left-4 right-4 bottom-4 sm:right-auto sm:left-5 sm:bottom-5 sm:w-[360px] bg-surface-container border border-[#383129] rounded-2xl shadow-2xl p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-primary tracking-wider text-[11px] flex items-center gap-1.5">
          <BookOpen size={13} /> Versículo do Dia
        </span>
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar versículo do dia"
          className="p-1 -mr-1 rounded-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
      <p className="text-sm text-on-surface leading-relaxed">“{texto}”</p>
      <p className="text-xs text-primary font-semibold">{ref}</p>
    </aside>
  );
}
