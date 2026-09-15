import { useEffect, useState } from "react";
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
      <div className="step">
        <h2 className="step__title">Agenda</h2>
        <p className="status-message">{professional.nome} não tem dias de trabalho configurados.</p>
        <button className="btn-ghost" onClick={onBack}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="step">
      <div>
        <h2 className="step__title">Escolha o horário</h2>
        <p className="step__subtitle">
          Com {professional.nome}, para {service.nome}
        </p>
      </div>

      <div className="day-scroll">
        {days.map((day) => (
          <button
            key={day.date}
            className={`day-chip ${day.date === selectedDay ? "day-chip--active" : ""}`}
            onClick={() => setSelectedDay(day.date)}
          >
            <span className="day-chip__weekday">{day.diaSemana}</span>
            <span className="day-chip__date">{day.diaMes}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="status-message">Buscando horários…</p>
      ) : slots.length === 0 ? (
        <p className="status-message">Sem horários livres nesse dia. Tente outra data.</p>
      ) : (
        <div className="slot-grid">
          {slots.map((slot) => (
            <button
              key={slot}
              className="slot-chip"
              onClick={() => {
                const [h, m] = slot.split(":").map(Number);
                const fim = new Date(0, 0, 0, h, m + service.duracaoMinutos);
                const horaFim = `${String(fim.getHours()).padStart(2, "0")}:${String(
                  fim.getMinutes(),
                ).padStart(2, "0")}`;
                onSelect(selectedDay, slot, horaFim);
              }}
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      <button className="btn-ghost" onClick={onBack}>
        Voltar
      </button>
    </div>
  );
}
