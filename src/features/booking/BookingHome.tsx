import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTenant } from "../../context/TenantContext";
import { watchProfessionals, watchServices } from "../../lib/repositories/catalog";
import { createAppointment } from "../../lib/repositories/appointments";
import type { Professional, Service } from "../../types";
import StepProgress from "./StepProgress";
import ProfessionalStep from "./ProfessionalStep";
import ServiceStep from "./ServiceStep";
import ScheduleStep from "./ScheduleStep";
import ClientFormStep from "./ClientFormStep";
import ConfirmationStep from "./ConfirmationStep";
import "./booking.css";

type Selection = {
  professional: Professional | null;
  service: Service | null;
  data: string | null;
  horaInicio: string | null;
  horaFim: string | null;
};

export default function BookingHome() {
  const { tenant } = useTenant();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<Selection>({
    professional: null,
    service: null,
    data: null,
    horaInicio: null,
    horaFim: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenant) return;
    const unsubProfessionals = watchProfessionals(tenant.id, setProfessionals);
    const unsubServices = watchServices(tenant.id, setServices);
    return () => {
      unsubProfessionals();
      unsubServices();
    };
  }, [tenant]);

  if (!tenant) return null;

  async function handleConfirm(nome: string, telefone: string) {
    if (!selection.professional || !selection.service || !selection.data || !selection.horaInicio || !selection.horaFim) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await createAppointment({
        tenantId: tenant!.id,
        professionalId: selection.professional.id,
        serviceId: selection.service.id,
        clientNome: nome,
        clientTelefone: telefone,
        data: selection.data,
        horaInicio: selection.horaInicio,
        horaFim: selection.horaFim,
      });
      setStep(5);
    } catch {
      setSubmitError("Não deu para confirmar agora. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-xl border-b border-[#383129] shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
        <div className="max-w-3xl mx-auto h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={tenant.logoUrl || "/logo_icon.png"}
              alt={tenant.nome}
              className="h-8 w-auto object-contain rounded"
              onError={(e) => {
                // Fallback to local logo if custom url fails
                (e.target as HTMLImageElement).src = "/logo_icon.png";
              }}
            />
            <div className="flex flex-col">
              <span className="font-label-caps text-primary tracking-widest text-[10px]">
                AGENDAMENTO
              </span>
              <h1 className="text-base font-bold text-on-surface tracking-tight leading-none truncate max-w-[200px] md:max-w-xs">
                {tenant.nome}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary text-[11px] font-semibold border border-secondary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Aberto
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl md:max-w-2xl mx-auto px-4 py-4 flex flex-col gap-3">
        {/* Shop Compact Branding & Address Banner */}
        <section className="bg-surface-container-low p-3.5 rounded-xl border border-[#383129] flex items-center gap-3 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary font-bold text-base flex-shrink-0 border border-[#383129]">
            {tenant.nome.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-on-surface truncate">{tenant.nome}</h2>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block flex-shrink-0" />
            </div>
            <p className="text-xs text-on-surface-variant truncate">
              {tenant.endereco ? `Aberto hoje • ${tenant.endereco}` : "Aberto hoje • Atendimento com excelência"}
            </p>
          </div>
        </section>

        {step === 1 && (
          <Link to="/" className="text-xs text-on-surface-variant hover:text-primary transition-colors self-start">
            ← Voltar ao início
          </Link>
        )}

        {step <= 4 && <StepProgress currentStep={step} />}

      {step === 1 && (
        <ProfessionalStep
          professionals={professionals}
          onSelect={(professional) => {
            setSelection((s) => ({ ...s, professional }));
            setStep(2);
          }}
        />
      )}

      {step === 2 && selection.professional && (
        <ServiceStep
          services={services}
          onSelect={(service) => {
            setSelection((s) => ({ ...s, service }));
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && selection.professional && selection.service && (
        <ScheduleStep
          tenantId={tenant.id}
          professional={selection.professional}
          service={selection.service}
          onSelect={(data, horaInicio, horaFim) => {
            setSelection((s) => ({ ...s, data, horaInicio, horaFim }));
            setStep(4);
          }}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && selection.professional && selection.service && selection.data && selection.horaInicio && (
        <ClientFormStep
          professional={selection.professional}
          service={selection.service}
          data={selection.data}
          horaInicio={selection.horaInicio}
          submitting={submitting}
          errorMessage={submitError}
          onSubmit={handleConfirm}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && selection.professional && selection.service && selection.data && selection.horaInicio && (
        <ConfirmationStep
          tenant={tenant}
          professional={selection.professional}
          service={selection.service}
          data={selection.data}
          horaInicio={selection.horaInicio}
        />
      )}
      </main>
    </div>
  );
}
