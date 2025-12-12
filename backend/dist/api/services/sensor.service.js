import prisma from "../../config/db.js";
import * as auditService from "./audit.service.js";
// --- CREATE (Admin) ---
export const createSensor = async (data, storeId, actor) => {
    // Перевіряємо, чи зона належить цьому ж магазину
    const zone = await prisma.zone.findFirst({
        where: {
            id: data.zone_id,
            store_id: storeId,
        },
    });
    if (!zone) {
        throw new Error("Зону не знайдено або вона не належить вашому магазину");
    }
    const sensor = await prisma.sensor.create({
        data: {
            ...data,
            store_id: storeId, // Прив'язка до магазину Адміна
        },
    });
    // ЛОГУВАННЯ
    await auditService.logAction(storeId, actor.email, actor.id, "CREATE_SENSOR", `Created sensor ${sensor.name} in zone ${sensor.zone_id}`);
    return sensor;
};
// --- READ ALL (Admin / Manager) ---
export const getAllSensors = async (storeId) => {
    return prisma.sensor.findMany({
        where: {
            store_id: storeId,
        },
        include: {
            zone: {
                // Додаємо інформацію про зону
                select: { id: true, name: true },
            },
        },
    });
};
// --- READ ONE (Admin / Manager) ---
export const getSensorById = async (sensorId, storeId) => {
    return prisma.sensor.findFirst({
        where: {
            id: sensorId,
            store_id: storeId,
        },
        include: {
            zone: true,
            assignedTo: {
                // Покажемо, кому призначений
                select: {
                    user: {
                        select: { id: true, first_name: true, last_name: true },
                    },
                },
            },
        },
    });
};
// --- UPDATE (Admin) ---
export const updateSensor = async (sensorId, storeId, data, actor) => {
    const { count } = await prisma.sensor.updateMany({
        where: {
            id: sensorId,
            store_id: storeId,
        },
        data: data,
    });
    if (count === 0) {
        throw new Error("Датчик не знайдено або у вас немає доступу");
    }
    // ЛОГУВАННЯ
    await auditService.logAction(storeId, actor.email, actor.id, "UPDATE_SENSOR", `Updated sensor ${sensorId}. Data: ${JSON.stringify(data)}`);
    return getSensorById(sensorId, storeId);
};
// --- DELETE (Admin) ---
export const deleteSensor = async (sensorId, storeId, actor) => {
    const { count } = await prisma.sensor.deleteMany({
        where: {
            id: sensorId,
            store_id: storeId,
        },
    });
    if (count === 0) {
        throw new Error("Датчик не знайдено або у вас немає доступу");
    }
    // ЛОГУВАННЯ
    await auditService.logAction(storeId, actor.email, actor.id, "DELETE_SENSOR", `Deleted sensor ${sensorId}`);
    return { message: "Датчик видалено" };
};
// --- ASSIGN SENSOR (Admin) ---
export const assignSensor = async (sensorId, workerId, adminStoreId, actor) => {
    // Потужна перевірка: переконуємось, що і Адмін, і Працівник,
    // і Датчик - всі з ОДНОГО магазину
    const [sensor, worker] = await Promise.all([
        prisma.sensor.findFirst({
            where: { id: sensorId, store_id: adminStoreId },
        }),
        prisma.user.findFirst({ where: { id: workerId, store_id: adminStoreId } }),
    ]);
    if (!sensor)
        throw new Error("Датчик не знайдено у вашому магазині");
    if (!worker)
        throw new Error("Працівника не знайдено у вашому магазині");
    if (worker.role !== "WORKER")
        throw new Error("Призначати можна лише Працівників");
    const result = await prisma.sensorAssignment.create({
        data: {
            user_id: workerId,
            sensor_id: sensorId,
        },
    });
    // ЛОГУВАННЯ
    await auditService.logAction(adminStoreId, actor.email, actor.id, "ASSIGN_SENSOR", `Assigned sensor ${sensorId} to worker ${workerId}`);
    return result;
};
// --- READ ASSIGNED (Worker) ---
export const getAssignedSensors = async (workerId) => {
    return prisma.sensorAssignment.findMany({
        where: {
            user_id: workerId,
        },
        include: {
            sensor: {
                // Включаємо повну інформацію про датчик
                include: {
                    zone: true, // І про його зону
                },
            },
        },
    });
};
//# sourceMappingURL=sensor.service.js.map