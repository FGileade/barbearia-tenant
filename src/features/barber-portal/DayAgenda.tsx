import { useEffect, useState } from "react";
import { Check, X, Calendar as CalendarIcon, Clock, Scissors, User } from "lucide-react";
import type { Appointment, Professional, Service } from "../../types";
import { watchAppointmentsForDay, cancelAppointment, completeAppointment } from "../../lib/repositories/appointments";

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function DayAgenda({
  tenantId,
  professionals,
  services,
}: {
  tenantId: string;
  professionals: Professional[];
  services: Service[];
}) {
  const [date, setDate] = useState(todayISO());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => watchAppointmentsForDay(tenantId, date, setAppointments), [tenantId, date]);

  function nomeDoProfissional(id: string): string {
    return professionals.find((p) => p.id === id)?.nome ?? "—";
  }

  function nomeDoServico(id: string): string {
    return services.find((s) => s.id === id)?.nome ?? "—";
  }

  async function handleCancel(id: string) {
    setBusyId(id);
    try {
      await cancelAppointment(id);
    } finally {
      setBusyId(null);
    }
  }

  async function handleComplete(id: string) {
    setBusyId(id);
    try {
      await completeAppointment(id);
    } finally {
      setBusyId(null);
    }
  }

  const dateFormatted = new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Metrics Bento Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date & Vitals Card */}
        <div className="bg-surface-container p-4 rounded-xl border border-[#383129] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-on-surface-variant">DIA SELECIONADO</span>
            <CalendarIcon size={16} className="text-primary" />
          </div>
          <div className="mt-2">
            <div className="text-lg font-bold text-on-surface capitalize">{dateFormatted}</div>
            <div className="font-label-data text-xs text-primary mt-0.5">
              {appointments.length} {appointments.length === 1 ? "agendamento" : "agendamentos"} no dia
            </div>
          </div>
        </div>

        {/* Date Selector Control Card */}
        <div className="bg-surface-container p-4 rounded-xl border border-[#383129] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-on-surface-variant">ALTERAR DATA</span>
            <Clock size={16} className="text-primary" />
          </div>
          <div className="mt-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface text-on-surface border border-[#383129] focus:border-primary focus:outline-none rounded-lg px-3 py-1.5 text-xs font-semibold"
            />
          </div>
        </div>
      </section>

      {/* Appointments List */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-caps text-on-surface-variant tracking-wider">
            Linha do Tempo
          </span>
          <span className="font-label-data text-xs text-on-surface-variant">
            {appointments.filter((a) => a.status === "confirmado").length} pendentes
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-surface-container p-8 rounded-xl border border-[#383129] text-center">
            <p className="text-on-surface-variant text-sm">
              Nenhum agendamento para {dateFormatted}.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {appointments.map((appointment) => {
              const isConfirmado = appointment.status === "confirmado";
              const isConcluido = appointment.status === "concluido";

              return (
                <div
                  key={appointment.id}
                  className="bg-surface-container p-4 rounded-xl border border-[#383129] hover:border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/25 text-primary font-bold text-xs tabular-nums flex-shrink-0 flex items-center gap-1">
                      <Clock size={12} />
                      {appointment.horaInicio}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface truncate">
                          {appointment.clientNome}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] border ${
                            isConfirmado
                              ? "bg-primary/15 text-primary border-primary/20"
                              : isConcluido
                              ? "bg-secondary-container/30 text-secondary border-secondary/20"
                              : "bg-error-container/20 text-[#ffb4ab] border-error/30"
                          }`}
                        >
                          {appointment.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <Scissors size={12} className="text-primary/70" />
                          {nomeDoServico(appointment.serviceId)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-primary/70" />
                          {nomeDoProfissional(appointment.professionalId)}
                        </span>
                        {appointment.clientTelefone && (
                          <>
                            <span>•</span>
                            <span className="tabular-nums text-on-surface-variant/80">
                              {appointment.clientTelefone}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {isConfirmado && (
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      <button
                        type="button"
                        title="Marcar como concluído"
                        disabled={busyId === appointment.id}
                        onClick={() => handleComplete(appointment.id)}
                        className="px-3 py-1.5 rounded-lg bg-secondary-container/20 hover:bg-secondary-container/40 border border-secondary/30 text-secondary text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <Check size={14} /> Concluir
                      </button>

                      <button
                        type="button"
                        title="Cancelar agendamento"
                        disabled={busyId === appointment.id}
                        onClick={() => handleCancel(appointment.id)}
                        className="px-3 py-1.5 rounded-lg bg-error-container/20 hover:bg-error-container/40 border border-error/30 text-[#ffb4ab] text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <X size={14} /> Cancelar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
