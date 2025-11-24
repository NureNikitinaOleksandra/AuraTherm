import prisma from "../../config/db.js";
import * as auditService from "./audit.service.js";

// --- ОТРИМАННЯ СПИСКУ  (Фільтрація) ---
export const getAllAlerts = async (
  storeId: string,
  status?: "NEW" | "ACKNOWLEDGED" | "RESOLVED"
) => {
  return prisma.alert.findMany({
    where: {
      store_id: storeId,
      ...(status ? { status: status } : {}), // Якщо передали статус - фільтруємо по ньому
    },
    include: {
      sensor: {
        // Підтягуємо назву датчика та зону
        select: { name: true, zone: { select: { name: true } } },
      },
      resolvedByUser: {
        // Хто вирішив (якщо є)
        select: { first_name: true, last_name: true },
      },
    },
    orderBy: { created_at: "desc" }, // Спочатку найновіші
  });
};

// --- ACKNOWLEDGE (Взяти в роботу) ---
export const acknowledgeAlert = async (
  alertId: string,
  storeId: string,
  actor: { id: string; email: string }
) => {
  const alert = await prisma.alert.findFirst({
    where: { id: alertId, store_id: storeId },
  });

  if (!alert) throw new Error("Alert not found or access denied");
  if (alert.status === "RESOLVED")
    throw new Error("Cannot acknowledge a resolved alert");

  const updatedAlert = await prisma.alert.update({
    where: { id: alertId },
    data: { status: "ACKNOWLEDGED" },
  });

  // ЛОГУВАННЯ
  await auditService.logAction(
    storeId,
    actor.email,
    actor.id,
    "ACKNOWLEDGE_ALERT",
    `Alert ${alertId} acknowledged by user`
  );

  return updatedAlert;
};

// --- RESOLVE (Вирішити) ---
export const resolveAlert = async (
  alertId: string,
  storeId: string,
  actor: { id: string; email: string }
) => {
  const alert = await prisma.alert.findFirst({
    where: { id: alertId, store_id: storeId },
  });

  if (!alert) throw new Error("Alert not found");

  const updatedAlert = await prisma.alert.update({
    where: { id: alertId },
    data: {
      status: "RESOLVED",
      resolved_by_user_id: actor.id, // Записуємо хто вирішив
    },
  });

  // ЛОГУВАННЯ
  await auditService.logAction(
    storeId,
    actor.email,
    actor.id,
    "RESOLVE_ALERT",
    `Alert ${alertId} resolved by user`
  );

  return updatedAlert;
};
