import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { TenantProvider, useTenant } from "./context/TenantContext";
import { BarberAuthProvider, useBarberAuth } from "./context/BarberAuthContext";
import BookingHome from "./features/booking/BookingHome";
import BarberLogin from "./features/barber-portal/BarberLogin";
import BarberDashboard from "./features/barber-portal/BarberDashboard";

// Envolve as rotas do cliente com o TenantProvider, resolvendo a barbearia
// a partir do slug na URL: /b/{slug}/...
function ClientArea() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  if (!tenantSlug) return <Navigate to="/" replace />;

  return (
    <TenantProvider slug={tenantSlug}>
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
// vínculo staff/{uid}.tenantId igual ao slug da URL.
function BarberArea() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  if (!tenantSlug) return <Navigate to="/" replace />;

  return (
    <BarberAuthProvider>
      <Routes>
        <Route path="login" element={<BarberLogin />} />
        <Route path="*" element={<ProtectedBarberArea tenantSlug={tenantSlug} />} />
      </Routes>
    </BarberAuthProvider>
  );
}

function ProtectedBarberArea({ tenantSlug }: { tenantSlug: string }) {
  const { user, staff, loading } = useBarberAuth();

  if (loading) return <p className="status-message">Carregando…</p>;
  if (!user || !staff || staff.tenantId !== tenantSlug) {
    return <Navigate to={`/admin/${tenantSlug}/login`} replace />;
  }
  return <BarberDashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Área pública do cliente, sem login: escolhe profissional, serviço e horário */}
        <Route path="/b/:tenantSlug/*" element={<ClientArea />} />

        {/* Área do barbeiro/gestor de cada barbearia */}
        <Route path="/admin/:tenantSlug/*" element={<BarberArea />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
