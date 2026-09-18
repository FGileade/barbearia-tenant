import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Appointment } from "../../types";
import type { BusyRange } from "../availability";
import { normalizePhone } from "../clientId";
import { upsertClient } from "./clients";

export interface NewAppointmentInput {
  tenantId: string;
  professionalId: string;
  serviceId: string;
  clientNome: string;
  clientTelefone: string;
  data: string; // "2026-09-20"
  horaInicio: string; // "14:30"
  horaFim: string;
}

/**
 * Fluxo de agendamento sem cadastro: garante o cliente (cria/atualiza) e
 * grava, numa única escrita em lote, o agendamento (com dados do cliente)
 * e o registro espelho em `availability` (sem dado pessoal — é isso que o
 * cliente consulta depois para saber quais horários já estão ocupados).
 */
export async function createAppointment(input: NewAppointmentInput): Promise<string> {
  const clientId = await upsertClient(input.tenantId, input.clientNome, input.clientTelefone);

  const appointmentRef = doc(collection(db, "appointments"));
  const availabilityRef = doc(db, "availability", appointmentRef.id);

  const batch = writeBatch(db);

  batch.set(appointmentRef, {
    tenantId: input.tenantId,
    professionalId: input.professionalId,
    serviceId: input.serviceId,
    clientId,
    clientNome: input.clientNome,
    clientTelefone: normalizePhone(input.clientTelefone),
    data: input.data,
    horaInicio: input.horaInicio,
    horaFim: input.horaFim,
    status: "confirmado",
    criadoEm: serverTimestamp(),
  });

  batch.set(availabilityRef, {
    tenantId: input.tenantId,
    professionalId: input.professionalId,
    data: input.data,
    horaInicio: input.horaInicio,
    horaFim: input.horaFim,
  });

  await batch.commit();
  return appointmentRef.id;
}

/** Usado na tela de confirmação: o cliente só enxerga o próprio agendamento pelo id que recebeu. */
export async function getAppointmentById(appointmentId: string): Promise<Appointment | null> {
  const snap = await getDoc(doc(db, "appointments", appointmentId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Appointment;
}

/**
 * Horários já ocupados de um profissional num dia — vem de `availability`,
 * que não carrega nome/telefone de ninguém, então pode ser público.
 * Nota: leitura pontual (sem tempo real); dois clientes escolhendo o mesmo
 * horário em poucos segundos ainda podem colidir — endurecer isso com uma
 * Cloud Function transacional é uma melhoria futura (ver regrasdenegocio.md).
 */
export async function getBusySlots(
  tenantId: string,
  professionalId: string,
  data: string,
): Promise<BusyRange[]> {
  const q = query(
    collection(db, "availability"),
    where("tenantId", "==", tenantId),
    where("professionalId", "==", professionalId),
    where("data", "==", data),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    horaInicio: d.data().horaInicio,
    horaFim: d.data().horaFim,
  }));
}

/** Usado no painel do barbeiro/gestor: agenda do dia, em tempo real. */
export function watchAppointmentsForDay(
  tenantId: string,
  data: string,
  onChange: (appointments: Appointment[]) => void,
) {
  const q = query(
    collection(db, "appointments"),
    where("tenantId", "==", tenantId),
    where("data", "==", data),
    orderBy("horaInicio", "asc"),
  );

  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment));
  });
}

/**
 * Cancela um agendamento (só staff). Também apaga o espelho em
 * `availability` — senão o horário continuaria marcado como ocupado para
 * sempre, mesmo depois do cancelamento (ver regrasdenegocio.md).
 */
export async function cancelAppointment(appointmentId: string): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, "appointments", appointmentId), { status: "cancelado" });
  batch.delete(doc(db, "availability", appointmentId));
  await batch.commit();
}

/** Marca um atendimento já realizado como concluído. */
export async function completeAppointment(appointmentId: string): Promise<void> {
  await updateDoc(doc(db, "appointments", appointmentId), { status: "concluido" });
}

/** Histórico de um cliente na barbearia (painel do staff), em tempo real. */
export function watchClientAppointments(
  tenantId: string,
  clientId: string,
  onChange: (appointments: Appointment[]) => void,
) {
  const q = query(
    collection(db, "appointments"),
    where("tenantId", "==", tenantId),
    where("clientId", "==", clientId),
  );

  return onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment);
    list.sort((a, b) => `${b.data} ${b.horaInicio}`.localeCompare(`${a.data} ${a.horaInicio}`));
    onChange(list);
  });
}
