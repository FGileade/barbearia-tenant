import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import type { Professional, Service } from "../../types";

export type NewProfessionalInput = Omit<Professional, "id">;
export type NewServiceInput = Omit<Service, "id">;

export function watchAllProfessionals(tenantId: string, onChange: (list: Professional[]) => void) {
  const q = query(collection(db, "professionals"), where("tenantId", "==", tenantId));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Professional));
  });
}

export function watchAllServices(tenantId: string, onChange: (list: Service[]) => void) {
  const q = query(collection(db, "services"), where("tenantId", "==", tenantId));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Service));
  });
}

export async function createProfessional(input: NewProfessionalInput): Promise<string> {
  const ref = await addDoc(collection(db, "professionals"), input);
  return ref.id;
}

export async function updateProfessional(
  id: string,
  input: Partial<NewProfessionalInput>,
): Promise<void> {
  await updateDoc(doc(db, "professionals", id), input);
}

export async function createService(input: NewServiceInput): Promise<string> {
  const ref = await addDoc(collection(db, "services"), input);
  return ref.id;
}

export async function updateService(id: string, input: Partial<NewServiceInput>): Promise<void> {
  await updateDoc(doc(db, "services", id), input);
}
