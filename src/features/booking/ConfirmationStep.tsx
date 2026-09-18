import { Check, MessageCircle, MapPin, Calendar, User, Scissors, RefreshCw } from "lucide-react";
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
    <div className="flex flex-col gap-5 py-3">
      {/* Top Success Icon */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-16 h-16 rounded-full bg-secondary/15 border-2 border-secondary flex items-center justify-center text-secondary shadow-[0_0_24px_rgba(78,135,82,0.35)] animate-in zoom-in-75 duration-300">
          <Check size={32} strokeWidth={3} />
        </div>
        <div>
          <span className="font-label-caps text-secondary tracking-widest text-[11px]">
            TUDO CERTO
          </span>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight mt-0.5">
            Agendamento Confirmado!
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Seu horário está garantido na {tenant.nome}.
          </p>
        </div>
      </div>

      {/* Voucher Ticket Card */}
      <section className="bg-surface-container rounded-2xl border border-[#383129] shadow-lg overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-surface-container-high px-4 py-3 border-b border-[#383129] flex items-center justify-between">
          <span className="font-label-caps text-primary tracking-wider text-xs">
            Comprovante de Reserva
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary border border-secondary/20 text-[10px] font-bold">
            CONFIRMADO
          </span>
        </div>

        {/* Ticket Details */}
        <div className="p-4 flex flex-col gap-3 text-xs">
          <div className="flex items-center gap-3 pb-2.5 border-b border-[#383129]/50">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <User size={16} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] text-on-surface-variant font-label-caps">Profissional</span>
              <span className="font-bold text-sm text-on-surface">{professional.nome}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-2.5 border-b border-[#383129]/50">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Scissors size={16} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] text-on-surface-variant font-label-caps">Procedimento</span>
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-sm text-on-surface">{service.nome}</span>
                <span className="font-bold text-primary tabular-nums">
                  {service.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-2.5 border-b border-[#383129]/50">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Calendar size={16} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] text-on-surface-variant font-label-caps">Data e Horário</span>
              <span className="font-bold text-sm text-on-surface">{dataFormatada} às {horaInicio}</span>
            </div>
          </div>

          {tenant.endereco && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <MapPin size={16} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] text-on-surface-variant font-label-caps">Local</span>
                <span className="text-xs text-on-surface-variant">{tenant.endereco}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-1">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-[#0b3819] font-extrabold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
          >
            <MessageCircle size={18} /> Avisar no WhatsApp
          </a>
        )}

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full bg-surface-container hover:bg-surface-container-high border border-[#383129] text-on-surface font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
        >
          <RefreshCw size={14} /> Fazer Novo Agendamento
        </button>
      </div>
    </div>
  );
}
