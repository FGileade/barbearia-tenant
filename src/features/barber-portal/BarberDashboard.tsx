import { useEffect, useState } from "react";
import { LogOut, Calendar, Users, Scissors } from "lucide-react";
import { useBarberAuth } from "../../context/BarberAuthContext";
import { watchAllProfessionals, watchAllServices } from "../../lib/repositories/management";
import type { Professional, Service } from "../../types";
import NotificationOptIn from "./NotificationOptIn";
import DayAgenda from "./DayAgenda";
import ProfessionalsManager from "./ProfessionalsManager";
import ServicesManager from "./ServicesManager";

const TABS = [
  { id: "agenda", label: "Agenda do Dia", icon: Calendar },
  { id: "profissionais", label: "Profissionais", icon: Users },
  { id: "servicos", label: "Tabela & Preços", icon: Scissors },
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

  const userInitial = staff.role ? staff.role.charAt(0).toUpperCase() : "B";

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-xl border-b border-[#383129] shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
        <div className="max-w-4xl mx-auto h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo_icon.png"
              alt="Logo Barbearia"
              className="h-8 w-auto object-contain rounded"
            />
            <div className="flex flex-col">
              <span className="font-label-caps text-primary tracking-widest text-[10px]">
                PAINEL OPERACIONAL
              </span>
              <h1 className="text-base font-bold text-on-surface tracking-tight leading-none">
                Deck do Barbeiro
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-[#383129] hover:border-error/40 text-on-surface-variant hover:text-error text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
            >
              <LogOut size={14} /> Sair
            </button>
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

        {/* Navigation Tabs (Barber Operational Deck) */}
        <nav className="grid grid-cols-3 gap-2 bg-surface-container-low p-1.5 rounded-xl border border-[#383129]">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`py-2.5 px-2 rounded-lg font-label-caps text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-[#191714] font-bold shadow-md"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <Icon size={14} />
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Push Notification Opt-in */}
        <NotificationOptIn tenantId={staff.tenantId} />

        {/* Tab View */}
        <div className="flex flex-col gap-4">
          {tab === "agenda" && (
            <DayAgenda tenantId={staff.tenantId} professionals={professionals} services={services} />
          )}
          {tab === "profissionais" && <ProfessionalsManager tenantId={staff.tenantId} />}
          {tab === "servicos" && <ServicesManager tenantId={staff.tenantId} />}
        </div>
      </main>
    </div>
  );
}
