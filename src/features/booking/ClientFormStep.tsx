import { useState, type FormEvent } from "react";
import { User, Phone, Calendar, Scissors, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Professional, Service } from "../../types";
import { isValidBrazilianPhone } from "../../lib/clientId";
import { formatName, maskPhone } from "../../lib/masks";

export default function ClientFormStep({
  professional,
  service,
  data,
  horaInicio,
  submitting,
  errorMessage,
  onSubmit,
  onBack,
}: {
  professional: Professional;
  service: Service;
  data: string;
  horaInicio: string;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (nome: string, telefone: string) => void;
  onBack: () => void;
}) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [touched, setTouched] = useState(false);

  const dataFormatada = new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const nomeValido = nome.trim().length >= 2;
  const telefoneValido = isValidBrazilianPhone(telefone);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!nomeValido || !telefoneValido) return;
    onSubmit(formatName(nome), telefone);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Booking Summary Voucher */}
      <section className="bg-surface-container p-4 rounded-xl border border-[#383129] flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#383129]/70 pb-2.5">
          <span className="font-label-caps text-primary tracking-wider">
            Resumo da Reserva
          </span>
          <span className="font-label-data text-xs text-on-surface-variant">
            {service.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <User size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-variant font-label-caps">Barbeiro</span>
              <span className="font-bold text-on-surface truncate">{professional.nome}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Scissors size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-variant font-label-caps">Serviço</span>
              <span className="font-bold text-on-surface truncate">{service.nome}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Calendar size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-on-surface-variant font-label-caps">Horário</span>
              <span className="font-bold text-on-surface truncate">{dataFormatada} às {horaInicio}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Fields */}
      <section className="bg-surface-container p-4 rounded-xl border border-[#383129] flex flex-col gap-3.5 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome" className="font-label-caps text-on-surface-variant text-[11px] tracking-wider flex items-center gap-1.5">
            <User size={13} className="text-primary" /> Seu Nome Completo
          </label>
          <input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onBlur={() => setNome((n) => formatName(n))}
            placeholder="Ex: Carlos Eduardo"
            autoComplete="name"
            autoCapitalize="words"
            required
            aria-required="true"
            aria-invalid={touched && !nomeValido}
            aria-describedby={touched && !nomeValido ? "nome-erro" : undefined}
            className="w-full bg-surface text-on-surface placeholder-[#6C6255] border border-[#383129] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg px-3.5 py-3 text-sm transition-colors"
          />
          {touched && !nomeValido && (
            <span id="nome-erro" role="alert" className="text-error text-xs font-medium">Por favor, informe seu nome.</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="telefone" className="font-label-caps text-on-surface-variant text-[11px] tracking-wider flex items-center gap-1.5">
            <Phone size={13} className="text-primary" /> WhatsApp / Celular
          </label>
          <input
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(maskPhone(e.target.value))}
            placeholder="(11) 91234-5678"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={15}
            required
            aria-required="true"
            aria-invalid={touched && !telefoneValido}
            aria-describedby={touched && !telefoneValido ? "telefone-erro" : undefined}
            className="w-full bg-surface text-on-surface placeholder-[#6C6255] border border-[#383129] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg px-3.5 py-3 text-sm transition-colors"
          />
          {touched && !telefoneValido && (
            <span id="telefone-erro" role="alert" className="text-error text-xs font-medium">Digite um número válido com DDD (Ex: (11) 98765-4321).</span>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-error-container/20 border border-error/30 text-[#ffb4ab] text-xs">
            {errorMessage}
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:bg-[#d4934e] active:bg-[#9e6328] text-[#191714] font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 size={18} />
          {submitting ? "Confirmando Agendamento..." : "Confirmar Agendamento"}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="w-full bg-surface-container/60 hover:bg-surface-container border border-[#383129] hover:border-primary/30 text-on-surface-variant hover:text-on-surface font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99] disabled:opacity-50"
        >
          <ArrowLeft size={15} /> Voltar para Horários
        </button>
      </div>
    </form>
  );
}
