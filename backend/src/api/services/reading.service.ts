import prisma from "../../config/db.js";
import * as notificationService from "./notification.service.js";

export const processReading = async (sensorId: string, temperature: number) => {
  const sensor = await prisma.sensor.findUnique({
    where: { id: sensorId },
    include: {
      zone: true,
      assignedTo: {
        select: { user_id: true },
      },
    },
  });

  if (!sensor) {
    throw new Error(`Sensor ${sensorId} not found`);
  }

  if (sensor.status !== "ACTIVE") {
    console.log(`Ignored reading for ${sensor.status} sensor: ${sensor.name}`);
    return;
  }

  await prisma.sensorReading.create({
    data: {
      sensor_id: sensorId,
      temperature: temperature,
    },
  });

  const { min_temp, max_temp } = sensor.zone;
  let isViolation = false;
  let violationType = "";

  if (temperature > max_temp) {
    isViolation = true;
    violationType = "Висока температура";
  } else if (temperature < min_temp) {
    isViolation = true;
    violationType = "Низька температура";
  }

  if (isViolation) {
    const existingAlert = await prisma.alert.findFirst({
      where: {
        sensor_id: sensorId,
        status: { not: "RESOLVED" }, // Тобто NEW або ACKNOWLEDGED
      },
    });

    if (!existingAlert) {
      const newAlert = await prisma.alert.create({
        data: {
          sensor_id: sensorId,
          store_id: sensor.store_id,
          status: "NEW",
        },
      });

      console.log(`🚨 Created Alert #${newAlert.id} for Sensor ${sensor.name}`);

      // Група А: Закріплені Працівники (Workers)
      const assignedWorkerIds = sensor.assignedTo.map((a) => a.user_id);

      // Група Б: Менеджери магазину (страховка)
      const managers = await prisma.user.findMany({
        where: {
          store_id: sensor.store_id,
          role: "MANAGER",
        },
        select: { id: true },
      });
      const managerIds = managers.map((m) => m.id);

      const recipients = Array.from(
        new Set([...assignedWorkerIds, ...managerIds])
      );

      if (recipients.length > 0) {
        await notificationService.sendPushNotification(
          recipients,
          `ТРИВОГА: ${sensor.name}`,
          `${violationType}: ${temperature}°C (Норма: ${min_temp}...${max_temp})`
        );
      } else {
        console.warn(
          "⚠️ Alert created, but NO recipients found! (No assigned worker & no manager)"
        );
      }
    } else {
      console.log(
        `⚠️ Alert continues for ${sensor.name}. Current: ${temperature}°C`
      );
    }
  }
};
