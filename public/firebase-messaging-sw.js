/* Gerado automaticamente por vite.config.ts a partir do .env — não edite à mão. */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  "apiKey": "AIzaSyCaenxqt40N9m9y_8iMmT-aeMJ8weGJKvQ",
  "authDomain": "bancodedados-barbearia.firebaseapp.com",
  "projectId": "bancodedados-barbearia",
  "storageBucket": "bancodedados-barbearia.firebasestorage.app",
  "messagingSenderId": "954189671981",
  "appId": "1:954189671981:web:4e610098d6f668c4ddd2a4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? "Novo agendamento", {
    body,
    icon: "/icon-192.png",
  });
});
