import { useState, type FormEvent } from "react";
import type { Professional } from "../../types";
import WeekdaySchedule from "./WeekdaySchedule";

const JORNADA_VAZIA: Professional["jornada"] = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };

export interface ProfessionalFormValues {
  nome: string;
  especialidades: string[];
  jornada: Professional["jornada"];
  ativo: boolean;
}

export default function ProfessionalForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Professional;
  onSubmit: (values: ProfessionalFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [especialidadesTexto, setEspecialidadesTexto] = useState(
    initial?.especialidades.join(", ") ?? "",
  );
  const [jornada, setJornada] = useState<Professional["jornada"]>(initial?.jornada ?? JORNADA_VAZIA);
  const [ativo, setAtivo] = useState(initial?.ativo ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        nome: nome.trim(),
        especialidades: especialidadesTexto
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        jornada,
        ativo,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="manager-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="prof-nome">Nome</label>
        <input id="prof-nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>

      <div className="field">
        <label htmlFor="prof-especialidades">Especialidades (separadas por vírgula)</label>
        <input
          id="prof-especialidades"
          value={especialidadesTexto}
          onChange={(e) => setEspecialidadesTexto(e.target.value)}
          placeholder="Corte, Barba, Sobrancelha"
        />
      </div>

      <div className="field">
        <span>Dias e horários de trabalho</span>
        <WeekdaySchedule jornada={jornada} onChange={setJornada} />
      </div>

      <label className="checkbox-field">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
        Ativo (aparece para clientes agendarem)
      </label>

      <div className="step__footer">
        <button className="btn-primary" type="submit" disabled={saving || !nome.trim()}>
          {saving ? "Salvando…" : "Salvar profissional"}
        </button>
        <button className="btn-ghost" type="button" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
