import { useState, type FormEvent } from "react";
import type { Service } from "../../types";

export interface ServiceFormValues {
  nome: string;
  duracaoMinutos: number;
  preco: number;
  ativo: boolean;
}

export default function ServiceForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Service;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [duracaoMinutos, setDuracaoMinutos] = useState(initial?.duracaoMinutos ?? 30);
  const [preco, setPreco] = useState(initial?.preco ?? 0);
  const [ativo, setAtivo] = useState(initial?.ativo ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ nome: nome.trim(), duracaoMinutos, preco, ativo });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="manager-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="serv-nome">Nome do serviço</label>
        <input id="serv-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="off" autoCapitalize="sentences" required />
      </div>

      <div className="field">
        <label htmlFor="serv-duracao">Duração (minutos)</label>
        <input
          id="serv-duracao"
          type="number"
          inputMode="numeric"
          min={5}
          step={5}
          value={duracaoMinutos}
          onChange={(e) => setDuracaoMinutos(Number(e.target.value))}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="serv-preco">Preço (R$)</label>
        <input
          id="serv-preco"
          type="number"
          inputMode="decimal"
          min={0}
          step={0.5}
          value={preco}
          onChange={(e) => setPreco(Number(e.target.value))}
          required
        />
      </div>

      <label className="checkbox-field">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
        Ativo (aparece para clientes escolherem)
      </label>

      <div className="step__footer">
        <button
          className="btn-primary"
          type="submit"
          disabled={saving || !nome.trim() || duracaoMinutos <= 0 || preco < 0}
        >
          {saving ? "Salvando…" : "Salvar serviço"}
        </button>
        <button className="btn-ghost" type="button" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
