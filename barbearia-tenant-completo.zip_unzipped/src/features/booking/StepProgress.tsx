const LABELS = ["Profissional", "Serviço", "Horário", "Confirmar"];

export default function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="stepper">
      {LABELS.map((label, index) => {
        const stepNumber = index + 1;
        const state =
          stepNumber < currentStep ? "done" : stepNumber === currentStep ? "active" : "pending";

        return (
          <div className={`stepper__item stepper__item--${state}`} key={label}>
            <span className="stepper__number">{stepNumber}</span>
            <span className="stepper__label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
