import { Clock, ArrowLeft } from "lucide-react";
import type { Service } from "../../types";

function formatPreco(preco: number): string {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ServiceStep({
  services,
  onSelect,
  onBack,
}: {
  services: Service[];
  onSelect: (service: Service) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <span className="font-label-caps text-on-surface-variant tracking-wider">
          Tabela de Procedimentos
        </span>
        <span className="font-label-data text-primary">
          {services.length} {services.length === 1 ? "serviço" : "serviços"}
        </span>
      </div>

      {services.length === 0 ? (
        <div className="bg-surface-container p-6 rounded-xl border border-[#383129] text-center my-2">
          <p className="text-on-surface-variant text-sm">
            Nenhum serviço disponível no momento.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service)}
              className="text-left bg-surface-container hover:bg-surface-container-high p-4 rounded-xl border border-[#383129] hover:border-primary/40 transition-all active:scale-[0.99] shadow-sm flex items-center justify-between group cursor-pointer"
            >
              <div className="flex flex-col min-w-0 flex-1 pr-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-sm md:text-base text-on-surface group-hover:text-primary transition-colors truncate">
                    {service.nome}
                  </span>
                  <div className="hidden sm:flex flex-1 mx-3 border-b border-dotted border-[#383129]/80 mb-1" />
                  <span className="font-bold text-sm md:text-base text-primary tabular-nums flex-shrink-0">
                    {formatPreco(service.preco)}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-3 mt-1.5 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1 font-label-data">
                    <Clock size={12} className="text-primary/80" />
                    {service.duracaoMinutos} min
                  </span>
                  <span className="sm:hidden font-semibold text-primary/90 text-[11px]">
                    {formatPreco(service.preco)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full bg-surface-container/60 hover:bg-surface-container border border-[#383129] hover:border-primary/30 text-on-surface-variant hover:text-on-surface font-semibold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
        >
          <ArrowLeft size={15} /> Voltar para Profissionais
        </button>
      </div>
    </div>
  );
}
