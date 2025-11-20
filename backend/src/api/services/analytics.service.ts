import prisma from "../../config/db.js";

// Дані для Дашборду (Загальна статистика)
export const getDashboardStats = async (storeId: string) => {
  // Рахуємо кількість датчиків
  const totalSensors = await prisma.sensor.count({
    where: { store_id: storeId },
  });

  // Рахуємо кількість АКТИВНИХ (не вирішених) тривог
  const activeAlerts = await prisma.alert.count({
    where: {
      store_id: storeId,
      status: { not: "RESOLVED" },
    },
  });

  // Отримуємо останні 5 подій аудиту (хто що робив останнім)
  const recentActivity = await prisma.auditLog.findMany({
    where: { store_id: storeId },
    take: 5,
    orderBy: { timestamp: "desc" },
    select: { action: true, details: true, timestamp: true, user_email: true },
  });

  return {
    totalSensors,
    activeAlerts,
    status: activeAlerts > 0 ? "WARNING" : "OK", // Статус магазину
    recentActivity,
  };
};

// Дані для Графіка (Історія одного датчика)
export const getSensorHistory = async (
  sensorId: string,
  storeId: string,
  days: number = 1
) => {
  // Вираховуємо дату "N днів тому"
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Перевірка доступу (чи датчик належить магазину)
  const sensor = await prisma.sensor.findFirst({
    where: { id: sensorId, store_id: storeId },
  });
  if (!sensor) throw new Error("Sensor not found");

  // Отримуємо показники
  const readings = await prisma.sensorReading.findMany({
    where: {
      sensor_id: sensorId,
      timestamp: {
        gte: startDate, // gte = Greater Than or Equal (Більше або дорівнює)
      },
    },
    orderBy: { timestamp: "asc" }, // Для графіка важливо по порядку
    select: { temperature: true, timestamp: true },
  });

  return readings;
};
