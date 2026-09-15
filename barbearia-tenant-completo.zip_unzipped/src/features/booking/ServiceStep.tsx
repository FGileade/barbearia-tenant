import type { Service } from "../../types";

function formatPreco(preco: number): string {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ServiceStep({
  services,
  onSelect,
  onBack,
}: {
  services: Service[];
  onSelect: (service: Service) => void;
  onBack: () => void;
}) {
  return (
    <div className="step">
      <div>
        <h2 className="step__title">Escolha o serviço</h2>
        <p className="step__subtitle">O preço já inclui tudo, sem taxa surpresa.</p>
      </div>

      {services.length === 0 ? (
        <p className="status-message">Nenhum serviço disponível no momento.</p>
      ) : (
        <div className="service-list">
          {services.map((service) => (
            <button key={service.id} className="service-row" onClick={() => onSelect(service)}>
              <span className="service-row__name">{service.nome}</span>
              <span className="service-row__leader" />
              <span className="service-row__meta">
                <span className="service-row__price">{formatPreco(service.preco)}</span>
                <span>{service.duracaoMinutos} min</span>
              </span>
            </button>
          ))}
        </div>
      )}

      <button className="btn-ghost" onClick={onBack}>
        Voltar
      </button>
    </div>
  );
}
