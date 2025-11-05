import prisma from "../../config/db.js";
import type { CreateSensorDto, UpdateSensorDto } from "../dtos/sensor.dto.js";

// --- CREATE (Admin) ---
export const createSensor = async (data: CreateSensorDto, storeId: string) => {
  // Перевіряємо, чи зона належить цьому ж магазину (безпека)
  const zone = await prisma.zone.findFirst({
    where: {
      id: data.zone_id,
      store_id: storeId,
    },
  });

  if (!zone) {
    throw new Error("Зону не знайдено або вона не належить вашому магазину");
  }

  return prisma.sensor.create({
    data: {
      ...data,
      store_id: storeId, // Прив'язка до магазину Адміна
    },
  });
};

// --- READ ALL (Admin / Manager) ---
export const getAllSensors = async (storeId: string) => {
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
export const getSensorById = async (sensorId: string, storeId: string) => {
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
export const updateSensor = async (
  sensorId: string,
  storeId: string,
  data: UpdateSensorDto
) => {
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
  return getSensorById(sensorId, storeId);
};

// --- DELETE (Admin) ---
export const deleteSensor = async (sensorId: string, storeId: string) => {
  const { count } = await prisma.sensor.deleteMany({
    where: {
      id: sensorId,
      store_id: storeId,
    },
  });

  if (count === 0) {
    throw new Error("Датчик не знайдено або у вас немає доступу");
  }
  return { message: "Датчик видалено" };
};

// --- ASSIGN SENSOR (Admin) ---
export const assignSensor = async (
  sensorId: string,
  workerId: string,
  adminStoreId: string
) => {
  // Потужна перевірка: переконуємось, що і Адмін, і Працівник,
  // і Датчик - всі з ОДНОГО магазину
  const [sensor, worker] = await Promise.all([
    prisma.sensor.findFirst({
      where: { id: sensorId, store_id: adminStoreId },
    }),
    prisma.user.findFirst({ where: { id: workerId, store_id: adminStoreId } }),
  ]);

  if (!sensor) throw new Error("Датчик не знайдено у вашому магазині");
  if (!worker) throw new Error("Працівника не знайдено у вашому магазині");
  if (worker.role !== "WORKER")
    throw new Error("Призначати можна лише Працівників");

  return prisma.sensorAssignment.create({
    data: {
      user_id: workerId,
      sensor_id: sensorId,
    },
  });
};

// --- READ ASSIGNED (Worker) ---
export const getAssignedSensors = async (workerId: string) => {
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
