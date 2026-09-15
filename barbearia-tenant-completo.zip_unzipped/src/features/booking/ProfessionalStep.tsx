import type { Professional } from "../../types";

export default function ProfessionalStep({
  professionals,
  onSelect,
}: {
  professionals: Professional[];
  onSelect: (professional: Professional) => void;
}) {
  if (professionals.length === 0) {
    return (
      <div className="step">
        <h2 className="step__title">Escolha o profissional</h2>
        <p className="status-message">Nenhum profissional disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="step">
      <div>
        <h2 className="step__title">Escolha o profissional</h2>
        <p className="step__subtitle">Quem vai te atender?</p>
      </div>

      <div className="professional-list">
        {professionals.map((professional) => (
          <button
            key={professional.id}
            className="professional-card"
            onClick={() => onSelect(professional)}
          >
            {professional.fotoUrl ? (
              <img
                className="professional-card__avatar"
                src={professional.fotoUrl}
                alt={professional.nome}
              />
            ) : (
              <span className="professional-card__avatar professional-card__avatar--placeholder">
                {professional.nome.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="professional-card__name">{professional.nome}</span>
            {professional.especialidades.length > 0 && (
              <span className="professional-card__specialties">
                {professional.especialidades.join(", ")}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
