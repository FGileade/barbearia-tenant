import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { TenantProvider, useTenant } from "./context/TenantContext";
import { BarberAuthProvider, useBarberAuth } from "./context/BarberAuthContext";
import BookingHome from "./features/booking/BookingHome";
import BarberLogin from "./features/barber-portal/BarberLogin";
import BarberDashboard from "./features/barber-portal/BarberDashboard";
import HomeLanding from "./HomeLanding";

// Em produção, cada barbearia tem o próprio deploy (um projeto Vercel por
// barbearia) com essa variável fixa no build — o app já nasce travado
// naquela barbearia, sem slug na URL (ver README.md). Sem ela, o app roda
// em "modo hub": a URL carrega o slug (/b/{slug}, /admin/{slug}/...) — só
// serve para testar várias barbearias num mesmo servidor local, não é
// usado em produção.
const FIXED_TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG?.trim() || undefined;

function ClientArea({ slug }: { slug: string }) {
  return (
    <TenantProvider slug={slug}>
      <TenantGate />
    </TenantProvider>
  );
}

function ClientAreaFromUrl() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  if (!tenantSlug) return <Navigate to="/" replace />;
  return <ClientArea slug={tenantSlug} />;
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
// vínculo staff/{uid}.tenantId igual ao slug da barbearia (fixo por
// deploy, ou vindo da URL no modo hub).
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

function BarberAreaFromUrl() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  if (!tenantSlug) return <Navigate to="/" replace />;
  return <BarberArea slug={tenantSlug} loginPath={`/admin/${tenantSlug}/login`} homePath={`/admin/${tenantSlug}`} />;
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
      <Route path="/" element={<ClientArea slug={slug} />} />
      <Route
        path="/admin/*"
        element={<BarberArea slug={slug} loginPath="/admin/login" homePath="/admin" />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Modo hub: um único deploy servindo várias barbearias pelo slug na URL.
// Usado só em desenvolvimento local (ver README.md) — não é a forma de
// publicar em produção.
function HubApp() {
  return (
    <Routes>
      <Route path="/" element={<HomeLanding />} />
      <Route path="/b/:tenantSlug/*" element={<ClientAreaFromUrl />} />
      <Route path="/admin/:tenantSlug/*" element={<BarberAreaFromUrl />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {FIXED_TENANT_SLUG ? <SingleTenantApp slug={FIXED_TENANT_SLUG} /> : <HubApp />}
    </BrowserRouter>
  );
}
