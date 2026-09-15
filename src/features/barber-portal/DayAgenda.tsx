import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import type { Appointment, Professional, Service } from "../../types";
import { watchAppointmentsForDay, cancelAppointment, completeAppointment } from "../../lib/repositories/appointments";

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function statusLabel(status: Appointment["status"]): string {
  if (status === "confirmado") return "Confirmado";
  if (status === "concluido") return "Concluído";
  return "Cancelado";
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

  return (
    <div className="manager-section">
      <div className="manager-section__header">
        <h2 className="step__title">Agenda do dia</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
      </div>

      {appointments.length === 0 ? (
        <p className="status-message">Nenhum agendamento para esse dia.</p>
      ) : (
        <ul className="agenda-list">
          {appointments.map((appointment) => (
            <li className="agenda-item" key={appointment.id}>
              <div className="agenda-item__time">{appointment.horaInicio}</div>
              <div className="agenda-item__info">
                <strong>{appointment.clientNome}</strong>
                <span>
                  {nomeDoServico(appointment.serviceId)} com {nomeDoProfissional(appointment.professionalId)}
                </span>
                <span className={`agenda-item__status agenda-item__status--${appointment.status}`}>
                  {statusLabel(appointment.status)}
                </span>
              </div>
              {appointment.status === "confirmado" && (
                <div className="agenda-item__actions">
                  <button
                    className="icon-btn"
                    title="Marcar como concluído"
                    disabled={busyId === appointment.id}
                    onClick={() => handleComplete(appointment.id)}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    className="icon-btn icon-btn--danger"
                    title="Cancelar"
                    disabled={busyId === appointment.id}
                    onClick={() => handleCancel(appointment.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
