import { getToken } from "firebase/messaging";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, getMessagingIfSupported } from "./firebase";

export type NotificationSetupResult = "granted" | "denied" | "unsupported";

/**
 * Pede permissão de notificação no navegador e, se concedida, registra o
 * token de push vinculado à barbearia (fcmTokens/{token}), para a Cloud
 * Function conseguir avisar esse dispositivo a cada novo agendamento.
 */
export async function enableAppointmentNotifications(
  tenantId: string,
): Promise<NotificationSetupResult> {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return "unsupported";

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return "denied";

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });
  if (!token) return "denied";

  await setDoc(doc(db, "fcmTokens", token), {
    tenantId,
    criadoEm: serverTimestamp(),
  });

  return "granted";
}
