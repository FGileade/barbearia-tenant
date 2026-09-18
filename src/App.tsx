import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TenantProvider, useTenant } from "./context/TenantContext";
import { BarberAuthProvider, useBarberAuth } from "./context/BarberAuthContext";
import BookingHome from "./features/booking/BookingHome";
import BarberLogin from "./features/barber-portal/BarberLogin";
import BarberDashboard from "./features/barber-portal/BarberDashboard";
import LandingPage from "./features/landing/LandingPage";
import AppSignature from "./components/AppSignature";
import VersiculoDoDia from "./components/VersiculoDoDia";

// Cada barbearia tem o próprio deploy (um projeto Vercel por barbearia) com
// essa variável fixa no build — o app nasce travado naquela barbearia, sem
// slug na URL (ver README.md). Em dev local, defina-a no .env.
const FIXED_TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG?.trim() || undefined;

function LandingArea({ slug }: { slug: string }) {
  return (
    <TenantProvider slug={slug}>
      <LandingPage />
    </TenantProvider>
  );
}

function ClientArea({ slug }: { slug: string }) {
  return (
    <TenantProvider slug={slug}>
      <TenantGate />
    </TenantProvider>
  );
}

function TenantGate() {
  const { tenant, loading, error } = useTenant();

  if (loading) return <p className="status-message">Carregando barbearia…</p>;
  if (error || !tenant) {
    return <p className="status-message status-message--error">{error ?? "Barbearia não encontrada."}</p>;
  }
  return <BookingHome />;
}

// Área do barbeiro/gestor: login público, painel protegido por sessão +
// vínculo staff/{uid}.tenantId igual ao slug da barbearia (fixo por deploy).
function BarberArea({ slug, loginPath, homePath }: { slug: string; loginPath: string; homePath: string }) {
  return (
    <BarberAuthProvider tenantSlug={slug}>
      <Routes>
        <Route path="login" element={<BarberLogin tenantSlug={slug} homePath={homePath} />} />
        <Route path="*" element={<ProtectedBarberArea tenantSlug={slug} loginPath={loginPath} />} />
      </Routes>
    </BarberAuthProvider>
  );
}

function ProtectedBarberArea({ tenantSlug, loginPath }: { tenantSlug: string; loginPath: string }) {
  const { user, staff, loading } = useBarberAuth();

  if (loading) return <p className="status-message">Carregando…</p>;
  if (!user || !staff || staff.tenantId !== tenantSlug) {
    return <Navigate to={loginPath} replace />;
  }
  return <BarberDashboard />;
}

// Deploy de barbearia única: sem slug na URL, tudo travado no tenant do build.
function SingleTenantApp({ slug }: { slug: string }) {
  return (
    <Routes>
      <Route path="/" element={<LandingArea slug={slug} />} />
      <Route path="/agendar" element={<ClientArea slug={slug} />} />
      <Route
        path="/admin/*"
        element={<BarberArea slug={slug} loginPath="/admin/login" homePath="/admin" />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="app-shell__content">
          {FIXED_TENANT_SLUG ? (
            <SingleTenantApp slug={FIXED_TENANT_SLUG} />
          ) : (
            <p className="status-message status-message--error">
              Barbearia não configurada: defina VITE_TENANT_SLUG no build.
            </p>
          )}
        </div>
        <AppSignature />
      </div>
      <VersiculoDoDia />
    </BrowserRouter>
  );
}
