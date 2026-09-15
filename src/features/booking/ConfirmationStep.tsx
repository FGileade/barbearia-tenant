import { Check } from "lucide-react";
import type { Professional, Service, Tenant } from "../../types";

export default function ConfirmationStep({
  tenant,
  professional,
  service,
  data,
  horaInicio,
}: {
  tenant: Tenant;
  professional: Professional;
  service: Service;
  data: string;
  horaInicio: string;
}) {
  const dataFormatada = new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const whatsappHref = tenant.telefone
    ? `https://wa.me/55${tenant.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Oi! Acabei de agendar ${service.nome} com ${professional.nome} para ${dataFormatada} às ${horaInicio}.`,
      )}`
    : null;

  return (
    <div className="step confirmation">
      <span className="confirmation__mark">
        <Check size={28} strokeWidth={3} />
      </span>

      <div>
        <h2 className="step__title">Agendamento confirmado</h2>
        <p className="step__subtitle">Te esperamos lá.</p>
      </div>

      <div className="summary-card">
        <div className="summary-card__row">
          <span>Profissional</span>
          <strong>{professional.nome}</strong>
        </div>
        <div className="summary-card__row">
          <span>Serviço</span>
          <strong>{service.nome}</strong>
        </div>
        <div className="summary-card__row">
          <span>Quando</span>
          <strong>
            {dataFormatada} às {horaInicio}
          </strong>
        </div>
        {tenant.endereco && (
          <div className="summary-card__row">
            <span>Endereço</span>
            <strong>{tenant.endereco}</strong>
          </div>
        )}
      </div>

      {whatsappHref && (
        <a className="btn-primary" href={whatsappHref} target="_blank" rel="noreferrer">
          Avisar a barbearia pelo WhatsApp
        </a>
      )}
    </div>
  );
}
