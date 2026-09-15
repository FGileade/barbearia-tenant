import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import type { Service } from "../../types";
import {
  createService,
  updateService,
  watchAllServices,
  type NewServiceInput,
} from "../../lib/repositories/management";
import ServiceForm, { type ServiceFormValues } from "./ServiceForm";

function formatPreco(preco: number): string {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ServicesManager({ tenantId }: { tenantId: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | "new" | null>(null);

  useEffect(() => watchAllServices(tenantId, setServices), [tenantId]);

  async function handleSubmit(values: ServiceFormValues) {
    if (editing === "new") {
      const input: NewServiceInput = { tenantId, ...values };
      await createService(input);
    } else if (editing) {
      await updateService(editing.id, values);
    }
    setEditing(null);
  }

  if (editing) {
    return (
      <ServiceForm
        initial={editing === "new" ? undefined : editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="manager-section">
      <div className="manager-section__header">
        <h2 className="step__title">Serviços</h2>
        <button className="btn-ghost" onClick={() => setEditing("new")}>
          <Plus size={16} /> Novo
        </button>
      </div>

      {services.length === 0 && <p className="status-message">Nenhum serviço cadastrado ainda.</p>}

      <ul className="manager-list">
        {services.map((service) => (
          <li className="manager-list__item" key={service.id}>
            <div>
              <strong>{service.nome}</strong>
              {!service.ativo && <span className="tag-inactive">inativo</span>}
              <p className="manager-list__meta">
                {formatPreco(service.preco)} ({service.duracaoMinutos} min)
              </p>
            </div>
            <button className="btn-ghost" onClick={() => setEditing(service)}>
              <Pencil size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
