import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useBarberAuth } from "../../context/BarberAuthContext";
import { watchAllProfessionals, watchAllServices } from "../../lib/repositories/management";
import type { Professional, Service } from "../../types";
import NotificationOptIn from "./NotificationOptIn";
import DayAgenda from "./DayAgenda";
import ProfessionalsManager from "./ProfessionalsManager";
import ServicesManager from "./ServicesManager";
import "./barber-portal.css";

const TABS = [
  { id: "agenda", label: "Agenda" },
  { id: "profissionais", label: "Profissionais" },
  { id: "servicos", label: "Serviços" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function BarberDashboard() {
  const { staff, logout } = useBarberAuth();
  const [tab, setTab] = useState<TabId>("agenda");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (!staff) return;
    const unsubProfessionals = watchAllProfessionals(staff.tenantId, setProfessionals);
    const unsubServices = watchAllServices(staff.tenantId, setServices);
    return () => {
      unsubProfessionals();
      unsubServices();
    };
  }, [staff]);

  if (!staff) return null;

  return (
    <div className="barber-dashboard">
      <header className="barber-dashboard__header">
        <h1 className="step__title">Painel da barbearia</h1>
        <button className="btn-ghost" onClick={logout}>
          <LogOut size={16} /> Sair
        </button>
      </header>

      <NotificationOptIn tenantId={staff.tenantId} />

      <nav className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-bar__item ${tab === t.id ? "tab-bar__item--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "agenda" && (
        <DayAgenda tenantId={staff.tenantId} professionals={professionals} services={services} />
      )}
      {tab === "profissionais" && <ProfessionalsManager tenantId={staff.tenantId} />}
      {tab === "servicos" && <ServicesManager tenantId={staff.tenantId} />}
    </div>
  );
}
