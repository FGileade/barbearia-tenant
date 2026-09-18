import { useEffect, useState } from "react";
import { LogOut, Calendar, Users, Scissors, Contact, Menu } from "lucide-react";
import { useBarberAuth } from "../../context/BarberAuthContext";
import { watchAllProfessionals, watchAllServices } from "../../lib/repositories/management";
import type { Professional, Service } from "../../types";
import NotificationOptIn from "./NotificationOptIn";
import DayAgenda from "./DayAgenda";
import ProfessionalsManager from "./ProfessionalsManager";
import ServicesManager from "./ServicesManager";
import ClientsManager from "./ClientsManager";
import NavDrawer from "./NavDrawer";

const TABS = [
  { id: "agenda", label: "Agenda do Dia", icon: Calendar },
  { id: "profissionais", label: "Profissionais", icon: Users },
  { id: "servicos", label: "Tabela & Preços", icon: Scissors },
  { id: "clientes", label: "Clientes", icon: Contact },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function BarberDashboard() {
  const { staff, logout } = useBarberAuth();
  const [tab, setTab] = useState<TabId>("agenda");
  const [menuOpen, setMenuOpen] = useState(false);
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

  const userInitial = staff.role ? staff.role.charAt(0).toUpperCase() : "B";

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-xl border-b border-[#383129] shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
        <div className="max-w-4xl mx-auto h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="p-2 -ml-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>
            <img
              src="/logo.svg"
              alt="Logo Barbearia"
              className="h-8 w-auto object-contain rounded"
            />
            <div className="flex flex-col">
              <span className="font-label-caps text-primary tracking-widest text-[10px]">
                PAINEL OPERACIONAL
              </span>
              <h1 className="text-base font-bold text-on-surface tracking-tight leading-none">
                {TABS.find((t) => t.id === tab)?.label}
              </h1>
            </div>
          </div>

        </div>
      </header>

      {/* Operational Deck & Content Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Operational Sub-Header Bar */}
        <section className="bg-surface-container-low p-3.5 rounded-xl border border-[#383129] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-[#383129] flex items-center justify-center text-primary font-bold text-sm shadow-sm flex-shrink-0">
              {userInitial}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-on-surface truncate">
                  {staff.role === "master" ? "Master Dev" : staff.role === "gestor" ? "Gestor da Barbearia" : "Barbeiro / Staff"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary text-[10px] font-semibold border border-secondary/20 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  ONLINE
                </span>
              </div>
              <span className="text-xs text-on-surface-variant truncate">
                Unidade: <span className="font-semibold text-on-surface">{staff.tenantId}</span>
              </span>
            </div>
          </div>
        </section>

        {/* Push Notification Opt-in */}
        <NotificationOptIn tenantId={staff.tenantId} />

        {/* Tab View */}
        <div className="flex flex-col gap-4">
          {tab === "agenda" && (
            <DayAgenda tenantId={staff.tenantId} professionals={professionals} services={services} />
          )}
          {tab === "profissionais" && <ProfessionalsManager tenantId={staff.tenantId} />}
          {tab === "servicos" && <ServicesManager tenantId={staff.tenantId} />}
          {tab === "clientes" && (
            <ClientsManager tenantId={staff.tenantId} professionals={professionals} services={services} />
          )}
        </div>
      </main>

      <NavDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={TABS}
        current={tab}
        onSelect={setTab}
        header={
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-surface-container-highest border border-[#383129] flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
              {userInitial}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-on-surface truncate">
                {staff.role === "master" ? "Master Dev" : staff.role === "gestor" ? "Gestor da Barbearia" : "Barbeiro / Staff"}
              </span>
              <span className="text-xs text-on-surface-variant truncate">Unidade: {staff.tenantId}</span>
            </div>
          </div>
        }
        footer={
          <button
            type="button"
            onClick={logout}
            className="w-full px-3 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-[#383129] hover:border-error/40 text-on-surface-variant hover:text-error text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95 cursor-pointer"
          >
            <LogOut size={16} /> Sair
          </button>
        }
      />
    </div>
  );
}
