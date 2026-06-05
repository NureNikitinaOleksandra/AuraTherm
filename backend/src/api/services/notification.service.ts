import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import prisma from "../../config/db.js";
import { readFileSync } from "fs";

// Ініціалізація Firebase
const serviceAccount = JSON.parse(
  readFileSync("./firebase-service-account.json", "utf-8"),
);

// Замість admin.apps.length використовуємо getApps().length
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const sendPushNotification = async (
  userIds: string[],
  title: string,
  body: string,
  alertId: string,
) => {
  // 1. Знаходимо користувачів з масиву ID, у яких є fcm_token
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
      fcm_token: { not: null },
    },
    select: { fcm_token: true },
  });

  const tokens = users.map((u) => u.fcm_token as string);

  if (tokens.length === 0) {
    console.log("⚠️ Пуш не відправлено: у користувачів немає FCM токенів.");
    return;
  }

  // 2. Формуємо повідомлення для Firebase
  const message = {
    notification: { title, body },
    data: { alertId: alertId },
    tokens: tokens,
  };

  // 3. Відправляємо через getMessaging()
  try {
    const response = await getMessaging().sendEachForMulticast(message);
    console.log(
      `✅ Відправлено пушів: ${response.successCount}, Помилок: ${response.failureCount}`,
    );
  } catch (error) {
    console.error("❌ Помилка відправки пуша:", error);
  }
};
