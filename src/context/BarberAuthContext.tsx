import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface StaffLink {
  tenantId: string;
  role: "master" | "gestor" | "barbeiro";
  nome?: string;
}

interface BarberAuthValue {
  user: User | null;
  staff: StaffLink | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const BarberAuthContext = createContext<BarberAuthValue>({
  user: null,
  staff: null,
  loading: true,
  logout: async () => {},
});

// `tenantSlug` é a barbearia do deploy (fixa no build, `VITE_TENANT_SLUG`).
// O usuário master não pertence a uma barbearia só, então herda essa.
export function BarberAuthProvider({ tenantSlug, children }: { tenantSlug: string; children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [staff, setStaff] = useState<StaffLink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setStaff(null);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsub = onSnapshot(
      doc(db, "staff", user.uid),
      (snap) => {
        if (!snap.exists()) {
          setStaff(null);
        } else {
          const link = snap.data() as StaffLink;
          setStaff(link.role === "master" ? { ...link, tenantId: tenantSlug } : link);
        }
        setLoading(false);
      },
      () => {
        setStaff(null);
        setLoading(false);
      },
    );

    return unsub;
  }, [user, tenantSlug]);

  return (
    <BarberAuthContext.Provider value={{ user, staff, loading, logout: () => signOut(auth) }}>
      {children}
    </BarberAuthContext.Provider>
  );
}

export function useBarberAuth() {
  return useContext(BarberAuthContext);
}
