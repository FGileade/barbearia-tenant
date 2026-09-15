import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { Professional, Service } from "../../types";

export function watchProfessionals(tenantId: string, onChange: (list: Professional[]) => void) {
  const q = query(
    collection(db, "professionals"),
    where("tenantId", "==", tenantId),
    where("ativo", "==", true),
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Professional));
  });
}

export function watchServices(tenantId: string, onChange: (list: Service[]) => void) {
  const q = query(
    collection(db, "services"),
    where("tenantId", "==", tenantId),
    where("ativo", "==", true),
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Service));
  });
}
