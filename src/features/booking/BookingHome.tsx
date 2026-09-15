import { useEffect, useState } from "react";
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
    <div className="booking">
      <header className="booking-header">
        {tenant.logoUrl ? (
          <img className="booking-header__logo" src={tenant.logoUrl} alt={tenant.nome} />
        ) : (
          <span className="booking-header__mark">{tenant.nome.charAt(0).toUpperCase()}</span>
        )}
        <div>
          <h1>{tenant.nome}</h1>
          {tenant.endereco && <p className="booking-header__address">{tenant.endereco}</p>}
        </div>
      </header>

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
    </div>
  );
}
