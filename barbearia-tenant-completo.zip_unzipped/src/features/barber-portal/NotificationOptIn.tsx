import { useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { enableAppointmentNotifications, type NotificationSetupResult } from "../../lib/notifications";

type Status = "idle" | "loading" | NotificationSetupResult;

export default function NotificationOptIn({ tenantId }: { tenantId: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    setStatus("loading");
    setStatus(await enableAppointmentNotifications(tenantId));
  }

  return (
    <div className="notification-optin">
      <div className="notification-optin__row">
        {status === "granted" ? <BellRing size={18} /> : <Bell size={18} />}
        <strong>Avisos de agendamento</strong>
      </div>

      {status === "granted" && (
        <p className="notification-optin__status">
          Ativado — você recebe um aviso a cada novo agendamento.
        </p>
      )}
      {status === "denied" && (
        <p className="notification-optin__status">
          Permissão negada. Ative pelas configurações do navegador para receber os avisos.
        </p>
      )}
      {status === "unsupported" && (
        <p className="notification-optin__status">
          Este navegador não tem suporte a notificações push.
        </p>
      )}
      {status === "loading" && <p className="notification-optin__status">Ativando…</p>}
      {status === "idle" && (
        <button className="btn-primary" onClick={handleClick}>
          Ativar avisos no navegador
        </button>
      )}
    </div>
  );
}
