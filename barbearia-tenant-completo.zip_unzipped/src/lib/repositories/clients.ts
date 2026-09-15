import { doc, serverTimestamp, setDoc, updateDoc, FirestoreError } from "firebase/firestore";
import { db } from "../firebase";
import { buildClientId, isValidBrazilianPhone, normalizePhone } from "../clientId";

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
