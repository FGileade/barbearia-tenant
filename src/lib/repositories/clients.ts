import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  FirestoreError,
} from "firebase/firestore";
import { db } from "../firebase";
import { buildClientId, isValidBrazilianPhone, normalizePhone } from "../clientId";
import type { Client } from "../../types";

/**
 * Cria ou atualiza o cliente automaticamente, sem cadastro/login prévio.
 * Chamado sempre que um cliente identifica nome + telefone para agendar.
 *
 * O app não tem permissão de leitura sobre `clients` (ver firestore.rules),
 * então não dá para simplesmente ler antes de decidir entre criar/atualizar.
 * Em vez disso: tenta atualizar; se o documento ainda não existir, cria —
 * assim `criadoEm` só é gravado uma vez, no primeiro agendamento.
 */
export async function upsertClient(tenantId: string, nome: string, telefoneRaw: string) {
  if (!isValidBrazilianPhone(telefoneRaw)) {
    throw new Error("Telefone inválido. Use um número com DDD.");
  }

  const telefone = normalizePhone(telefoneRaw);
  const clientId = buildClientId(tenantId, telefoneRaw);
  const ref = doc(db, "clients", clientId);

  try {
    await updateDoc(ref, {
      nome,
      ultimoAgendamentoEm: serverTimestamp(),
    });
  } catch (err) {
    if ((err as FirestoreError).code !== "not-found") throw err;

    await setDoc(ref, {
      tenantId,
      nome,
      telefone,
      criadoEm: serverTimestamp(),
      ultimoAgendamentoEm: serverTimestamp(),
    });
  }

  return clientId;
}

// serverTimestamp() volta do Firestore como Timestamp; o resto do app usa ms.
function toMillis(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (value && typeof (value as { toMillis?: unknown }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  return undefined;
}

/** Painel do staff: todos os clientes da barbearia, em tempo real. */
export function watchClients(tenantId: string, onChange: (clients: Client[]) => void, onError?: () => void) {
  const q = query(collection(db, "clients"), where("tenantId", "==", tenantId));
  return onSnapshot(
    q,
    (snap) => {
      onChange(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            tenantId: data.tenantId,
            nome: data.nome,
            telefone: data.telefone,
            criadoEm: toMillis(data.criadoEm) ?? 0,
            ultimoAgendamentoEm: toMillis(data.ultimoAgendamentoEm),
          } as Client;
        }),
      );
    },
    onError,
  );
}

export async function renameClient(clientId: string, nome: string): Promise<void> {
  await updateDoc(doc(db, "clients", clientId), { nome });
}

/** Remove só o cadastro do cliente; os agendamentos dele continuam no histórico da barbearia. */
export async function deleteClient(clientId: string): Promise<void> {
  await deleteDoc(doc(db, "clients", clientId));
}
