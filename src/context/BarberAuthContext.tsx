import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface StaffLink {
  tenantId: string;
  role: "gestor" | "barbeiro";
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

export function BarberAuthProvider({ children }: { children: ReactNode }) {
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
        setStaff(snap.exists() ? (snap.data() as StaffLink) : null);
        setLoading(false);
      },
      () => {
        setStaff(null);
        setLoading(false);
      },
    );

    return unsub;
  }, [user]);

  return (
    <BarberAuthContext.Provider value={{ user, staff, loading, logout: () => signOut(auth) }}>
      {children}
    </BarberAuthContext.Provider>
  );
}

export function useBarberAuth() {
  return useContext(BarberAuthContext);
}
