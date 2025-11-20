/**
 * Сервіс для відправки сповіщень.
 * На даному етапі це імітація (Mock).
 */
export const sendPushNotification = async (
  userIds: string[],
  title: string,
  message: string
) => {
  // Потім тут буде код для Apple (APNs).

  console.log("\n========================================");
  console.log("🔔 [MOCK PUSH NOTIFICATION]");
  console.log(`To Users: ${userIds.join(", ")}`);
  console.log(`Title:    ${title}`);
  console.log(`Message:  ${message}`);
  console.log("========================================\n");

  // Імітуємо затримку мережі
  return new Promise((resolve) => setTimeout(resolve, 100));
};

export const sendSystemAlert = async (storeId: string, message: string) => {
  console.log(`⚠️ [SYSTEM ALERT] Store ${storeId}: ${message}`);
};
