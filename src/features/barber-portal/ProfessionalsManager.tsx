import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import type { Professional } from "../../types";
import {
  createProfessional,
  updateProfessional,
  watchAllProfessionals,
  type NewProfessionalInput,
} from "../../lib/repositories/management";
import ProfessionalForm, { type ProfessionalFormValues } from "./ProfessionalForm";

export default function ProfessionalsManager({ tenantId }: { tenantId: string }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [editing, setEditing] = useState<Professional | "new" | null>(null);

  useEffect(() => watchAllProfessionals(tenantId, setProfessionals), [tenantId]);

  async function handleSubmit(values: ProfessionalFormValues) {
    if (editing === "new") {
      const input: NewProfessionalInput = { tenantId, ...values };
      await createProfessional(input);
    } else if (editing) {
      await updateProfessional(editing.id, values);
    }
    setEditing(null);
  }

  if (editing) {
    return (
      <ProfessionalForm
        initial={editing === "new" ? undefined : editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="manager-section">
      <div className="manager-section__header">
        <h2 className="step__title">Profissionais</h2>
        <button className="btn-ghost" onClick={() => setEditing("new")}>
          <Plus size={16} /> Novo
        </button>
      </div>

      {professionals.length === 0 && <p className="status-message">Nenhum profissional cadastrado ainda.</p>}

      <ul className="manager-list">
        {professionals.map((professional) => (
          <li className="manager-list__item" key={professional.id}>
            <div>
              <strong>{professional.nome}</strong>
              {!professional.ativo && <span className="tag-inactive">inativo</span>}
              <p className="manager-list__meta">{professional.especialidades.join(", ") || "Sem especialidades definidas"}</p>
            </div>
            <button className="btn-ghost" onClick={() => setEditing(professional)}>
              <Pencil size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
