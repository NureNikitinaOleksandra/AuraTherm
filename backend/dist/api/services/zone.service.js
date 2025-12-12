import prisma from "../../config/db.js";
import * as auditService from "./audit.service.js";
// --- CREATE (Admin) ---
export const createZone = async (data, storeId, actor) => {
    const zone = await prisma.zone.create({
        data: {
            ...data,
            store_id: storeId,
        },
    });
    await auditService.logAction(storeId, actor.email, actor.id, "CREATE_ZONE", `Created zone ${zone.name}`);
    return zone;
};
// --- READ ALL (Admin / Manager) ---
export const getAllZones = async (storeId) => {
    return prisma.zone.findMany({
        where: {
            store_id: storeId,
        },
        include: {
            _count: {
                select: { sensors: true },
            },
        },
    });
};
// --- READ ONE (Admin / Manager) ---
export const getZoneById = async (zoneId, storeId) => {
    return prisma.zone.findFirst({
        where: {
            id: zoneId,
            store_id: storeId,
        },
        include: {
            sensors: {
                // Покажемо всі датчики в цій зоні
                select: { id: true, name: true, status: true },
            },
        },
    });
};
// --- UPDATE (Admin) ---
export const updateZone = async (zoneId, storeId, data, actor) => {
    const { count } = await prisma.zone.updateMany({
        where: {
            id: zoneId,
            store_id: storeId,
        },
        data: data,
    });
    if (count === 0) {
        throw new Error("Зону не знайдено або у вас немає доступу");
    }
    await auditService.logAction(storeId, actor.email, actor.id, "UPDATE_ZONE", // Дія
    `Updated zone ${zoneId}. Data: ${JSON.stringify(data)}` // Деталі
    );
    return getZoneById(zoneId, storeId);
};
// --- DELETE (Admin) ---
export const deleteZone = async (zoneId, storeId, actor) => {
    const sensorsInZone = await prisma.sensor.count({
        where: { zone_id: zoneId },
    });
    if (sensorsInZone > 0) {
        throw new Error("Неможливо видалити зону, оскільки до неї прив'язані датчики");
    }
    // Якщо датчиків немає, видаляємо
    const { count } = await prisma.zone.deleteMany({
        where: {
            id: zoneId,
            store_id: storeId,
        },
    });
    if (count === 0) {
        throw new Error("Зону не знайдено або у вас немає доступу");
    }
    await auditService.logAction(storeId, actor.email, actor.id, "DELETE_ZONE", `Deleted zone ${zoneId}`);
    return { message: "Зону видалено" };
};
//# sourceMappingURL=zone.service.js.map