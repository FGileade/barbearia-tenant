import { useState, type FormEvent } from "react";
import type { Professional, Service } from "../../types";
import { isValidBrazilianPhone } from "../../lib/clientId";

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
    onSubmit(nome.trim(), telefone);
  }

  return (
    <form className="step" onSubmit={handleSubmit}>
      <div>
        <h2 className="step__title">Confirme seus dados</h2>
        <p className="step__subtitle">Sem senha, sem cadastro — só para avisar você do horário.</p>
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
      </div>

      <div className="field">
        <label htmlFor="nome">Seu nome</label>
        <input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Como podemos te chamar"
          autoComplete="name"
        />
        {touched && !nomeValido && <span className="field-error">Digite seu nome.</span>}
      </div>

      <div className="field">
        <label htmlFor="telefone">Seu telefone (com DDD)</label>
        <input
          id="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="(11) 91234-5678"
          inputMode="tel"
          autoComplete="tel"
        />
        {touched && !telefoneValido && (
          <span className="field-error">Digite um telefone válido, com DDD.</span>
        )}
      </div>

      {errorMessage && <span className="field-error">{errorMessage}</span>}

      <div className="step__footer">
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Confirmando…" : "Confirmar agendamento"}
        </button>
        <button className="btn-ghost" type="button" onClick={onBack} disabled={submitting}>
          Voltar
        </button>
      </div>
    </form>
  );
}
