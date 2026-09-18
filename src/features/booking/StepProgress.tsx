const STEP_TITLES = [
  "Escolha o Profissional",
  "Escolha o Serviço",
  "Escolha a Data e Horário",
  "Identificação e Confirmação",
];

export default function StepProgress({ currentStep }: { currentStep: number }) {
  const safeStep = Math.max(1, Math.min(4, currentStep));
  const percentage = safeStep * 25;
  const title = STEP_TITLES[safeStep - 1];

  return (
    <div className="w-full px-4 py-3 flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-primary tracking-wider">
          Etapa {safeStep} de 4
        </span>
        <span className="font-label-data text-on-surface-variant">
          {percentage}% concluído
        </span>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
        {title}
      </h2>
      <div className="grid grid-cols-4 gap-1.5 mt-1">
        {[1, 2, 3, 4].map((stepIdx) => {
          const isDoneOrActive = stepIdx <= safeStep;
          return (
            <div
              key={stepIdx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isDoneOrActive
                  ? "bg-primary shadow-[0_0_8px_rgba(193,127,59,0.35)]"
                  : "bg-surface-container-highest"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
