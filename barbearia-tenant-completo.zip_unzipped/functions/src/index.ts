import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions/v2";

initializeApp();
const db = getFirestore();
const messaging = getMessaging();

/**
 * Dispara ao criar um novo documento em `appointments`. Busca os tokens de
 * push registrados pelo staff daquela barbearia (fcmTokens) e envia o
 * aviso. Tokens que não existem mais (app desinstalado, etc.) são
 * removidos automaticamente.
 */
export const onAppointmentCreated = onDocumentCreated(
  "appointments/{appointmentId}",
  async (event) => {
    const appointment = event.data?.data();
    if (!appointment) return;

    const tokensSnap = await db
      .collection("fcmTokens")
      .where("tenantId", "==", appointment.tenantId)
      .get();

    if (tokensSnap.empty) {
      logger.info("Nenhum dispositivo do staff registrado para notificação.", {
        tenantId: appointment.tenantId,
      });
      return;
    }

    const tokens = tokensSnap.docs.map((doc) => doc.id);

    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: "Novo agendamento",
        body: `${appointment.clientNome} agendou para ${appointment.data} às ${appointment.horaInicio}.`,
      },
    });

    // Limpa tokens inválidos/expirados para não acumular lixo na coleção.
    const invalidTokens = response.responses
      .map((result, index) => (result.success ? null : tokens[index]))
      .filter((token): token is string => token !== null);

    await Promise.all(
      invalidTokens.map((token) => db.collection("fcmTokens").doc(token).delete()),
    );
  },
);
