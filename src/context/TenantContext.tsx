import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Tenant } from "../types";

interface TenantContextValue {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  loading: true,
  error: null,
});

export function TenantProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTenant() {
      setLoading(true);
      setError(null);
      try {
        const ref = doc(db, "tenants", slug);
        const snap = await getDoc(ref);
        if (cancelled) return;

        if (!snap.exists() || snap.data().ativo === false) {
          setTenant(null);
          setError("Barbearia não encontrada.");
        } else {
          setTenant({ id: snap.id, ...snap.data() } as Tenant);
        }
      } catch {
        if (!cancelled) setError("Não foi possível carregar a barbearia.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTenant();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Aplica a marca da barbearia (cor primária) como variável CSS global,
  // assim cada tenant pode ter sua própria identidade visual sem precisar
  // de builds/deploys separados.
  useEffect(() => {
    if (tenant?.corPrimaria) {
      document.documentElement.style.setProperty("--tenant-primary", tenant.corPrimaria);
    }
  }, [tenant?.corPrimaria]);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
