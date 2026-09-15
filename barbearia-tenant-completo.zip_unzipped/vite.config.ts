import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// O service worker do FCM roda fora do bundle do Vite, então não recebe as
// variáveis VITE_* automaticamente. Este plugin gera o arquivo com as
// credenciais reais toda vez que o app builda/roda em dev, a partir do
// mesmo .env que o resto do projeto usa.
function generateFirebaseMessagingSw(env: Record<string, string>): Plugin {
  return {
    name: 'generate-firebase-messaging-sw',
    buildStart() {
      const config = {
        apiKey: env.VITE_FIREBASE_API_KEY ?? '',
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
        projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
        appId: env.VITE_FIREBASE_APP_ID ?? '',
      }

      const content = `/* Gerado automaticamente por vite.config.ts a partir do .env — não edite à mão. */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp(${JSON.stringify(config, null, 2)});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? "Novo agendamento", {
    body,
    icon: "/icon-192.png",
  });
});
`

      writeFileSync(resolve(import.meta.dirname, 'public/firebase-messaging-sw.js'), content)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), generateFirebaseMessagingSw(env)],
  }
})
