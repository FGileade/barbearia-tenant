import { useEffect, useState } from "react";
import { ArrowLeft, Clock, User, Scissors } from "lucide-react";
import type { Professional, Service } from "../../types";
import { getAvailableSlots, getUpcomingDays } from "../../lib/availability";
import { getBusySlots } from "../../lib/repositories/appointments";

export default function ScheduleStep({
  tenantId,
  professional,
  service,
  onSelect,
  onBack,
}: {
  tenantId: string;
  professional: Professional;
  service: Service;
  onSelect: (data: string, horaInicio: string, horaFim: string) => void;
  onBack: () => void;
}) {
  const days = getUpcomingDays(professional);
  const [selectedDay, setSelectedDay] = useState(days[0]?.date ?? "");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const day = days.find((d) => d.date === selectedDay);
    if (!day) return;

    let cancelled = false;
    setLoading(true);

    getBusySlots(tenantId, professional.id, selectedDay)
      .then((busySlots) => {
        if (cancelled) return;
        setSlots(
          getAvailableSlots({
            professional,
            weekday: day.weekday,
            serviceDurationMinutes: service.duracaoMinutos,
            busySlots,
          }),
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, professional.id, service.duracaoMinutos]);

  if (days.length === 0) {
    return (
      <div className="bg-surface-container p-6 rounded-xl border border-[#383129] text-center my-4 flex flex-col gap-4">
        <p className="text-on-surface-variant text-sm">
          {professional.nome} não tem horários ou escalas de trabalho configurados.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="bg-surface-container/60 hover:bg-surface-container border border-[#383129] text-on-surface font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft size={14} /> Voltar para Serviços
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Selected Items Context Card */}
      <section className="bg-surface-container-low p-3.5 rounded-xl border border-[#383129] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <User size={15} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-caps text-[10px] text-primary">Profissional</span>
            <span className="font-bold text-on-surface truncate">{professional.nome}</span>
          </div>
        </div>

        <div className="h-6 border-r border-[#383129] mx-2" />

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <Scissors size={15} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-caps text-[10px] text-primary">Procedimento</span>
            <span className="font-bold text-on-surface truncate">{service.nome}</span>
          </div>
        </div>
      </section>

      {/* Day Selector (Horizontal Scroller) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-caps text-on-surface-variant tracking-wider">
            Escolha o Dia
          </span>
          <span className="font-label-data text-on-surface-variant">Próximos dias</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {days.map((day) => {
            const isSelected = day.date === selectedDay;
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDay(day.date)}
                className={`flex-shrink-0 min-w-[70px] py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-primary text-[#191714] border-primary font-bold shadow-[0_0_12px_rgba(193,127,59,0.3)]"
                    : "bg-surface-container hover:bg-surface-container-high border-[#383129] text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className={`text-[10px] uppercase font-label-caps ${isSelected ? "text-[#191714]" : "text-on-surface-variant"}`}>
                  {day.diaSemana}
                </span>
                <span className={`text-base font-extrabold ${isSelected ? "text-[#191714]" : "text-on-surface"}`}>
                  {day.diaMes}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Available Slots */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-caps text-on-surface-variant tracking-wider">
            Horários Disponíveis
          </span>
          <span className="font-label-data text-primary">
            {loading ? "Buscando..." : `${slots.length} livres`}
          </span>
        </div>

        {loading ? (
          <div className="bg-surface-container p-6 rounded-xl border border-[#383129] text-center my-1">
            <p className="text-on-surface-variant text-xs">Carregando horários livres...</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="bg-surface-container p-6 rounded-xl border border-[#383129] text-center my-1">
            <p className="text-on-surface-variant text-sm">
              Nenhum horário livre para este dia. Escolha outra data acima.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  const [h, m] = slot.split(":").map(Number);
                  const fim = new Date(0, 0, 0, h, m + service.duracaoMinutos);
                  const horaFim = `${String(fim.getHours()).padStart(2, "0")}:${String(
                    fim.getMinutes(),
                  ).padStart(2, "0")}`;
                  onSelect(selectedDay, slot, horaFim);
                }}
                className="py-2.5 px-3 rounded-lg bg-surface-container hover:bg-primary/10 border border-[#383129] hover:border-primary text-on-surface hover:text-primary font-bold text-xs tracking-wide transition-all active:scale-95 shadow-sm text-center flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <Clock size={12} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                {slot}
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full bg-surface-container/60 hover:bg-surface-container border border-[#383129] hover:border-primary/30 text-on-surface-variant hover:text-on-surface font-semibold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
        >
          <ArrowLeft size={15} /> Voltar para Serviços
        </button>
      </div>
    </div>
  );
}
