import { Zap, Calendar, ChevronRight } from "lucide-react";
import type { Professional } from "../../types";

export default function ProfessionalStep({
  professionals,
  onSelect,
}: {
  professionals: Professional[];
  onSelect: (professional: Professional) => void;
}) {
  if (professionals.length === 0) {
    return (
      <div className="bg-surface-container p-6 rounded-xl border border-[#383129] text-center my-4">
        <p className="text-on-surface-variant text-sm">
          Nenhum profissional cadastrado ou disponível no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Express Option: First Available Barber */}
      <section>
        <button
          type="button"
          onClick={() => onSelect(professionals[0])}
          className="w-full text-left bg-surface-container hover:bg-surface-container-high p-4 rounded-xl border border-[#383129] flex items-center justify-between transition-all active:scale-[0.98] shadow-sm group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <Zap size={22} className="fill-primary/20" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-bold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                Primeiro Horário Livre
              </h3>
              <p className="text-xs text-on-surface-variant truncate">
                Para quem tem pressa ou sem preferência
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end flex-shrink-0 pl-2">
            <span className="bg-secondary-container/30 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-label-data text-[11px] flex items-center gap-1">
              Mais Rápido
            </span>
          </div>
        </button>
      </section>

      {/* Barbers Grid */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-caps text-on-surface-variant tracking-wider">
            Nossa Equipe de Mestres
          </span>
          <span className="font-label-data text-primary">
            {professionals.length} {professionals.length === 1 ? "disponível" : "disponíveis"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {professionals.map((professional) => {
            const badgeLabel = professional.especialidades[0]
              ? professional.especialidades[0].toUpperCase()
              : "MESTRE";

            return (
              <button
                key={professional.id}
                type="button"
                onClick={() => onSelect(professional)}
                className="text-left bg-surface-container hover:bg-surface-container-high p-4 rounded-xl border border-[#383129] hover:border-primary/40 flex flex-col justify-between transition-all active:scale-[0.98] shadow-sm min-h-[160px] group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="relative">
                      {professional.fotoUrl ? (
                        <img
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#383129] group-hover:border-primary/50 transition-colors shadow-sm"
                          src={professional.fotoUrl}
                          alt={professional.nome}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-surface-container-highest border-2 border-[#383129] group-hover:border-primary/50 transition-colors flex items-center justify-center font-bold text-primary text-base shadow-sm">
                          {professional.nome.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="bg-primary/15 text-primary border border-primary/20 px-2 py-0.5 rounded font-label-caps text-[10px]">
                      {badgeLabel}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-on-surface mt-3 truncate group-hover:text-primary transition-colors">
                    {professional.nome}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                    {professional.especialidades.length > 0
                      ? professional.especialidades.join(" • ")
                      : "Corte, Barba & Estilo"}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#383129]/60 flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1.5 font-label-data text-primary/90">
                    <Calendar size={13} className="text-primary" />
                    Horários disponíveis
                  </span>
                  <ChevronRight size={16} className="text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
