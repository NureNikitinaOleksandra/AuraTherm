import { z } from "zod";
import { SensorStatus } from "@prisma/client";
// Схема для створення (Admin)
export const createSensorSchema = z.object({
    name: z.string().min(1, { message: "Ім'я не може бути порожнім" }),
    location: z.string().optional(),
    status: z.nativeEnum(SensorStatus).default("ACTIVE"),
    zone_id: z
        .string()
        .min(1, { message: "zone_id є обов'язковим" })
        .uuid({ message: "zone_id має бути валідним UUID" }),
});
// Схема для оновлення (Admin)
// .partial() робить всі поля опціональними
export const updateSensorSchema = createSensorSchema.partial();
// Схема для призначення датчика працівнику (Admin)
export const assignSensorSchema = z.object({
    userId: z.string().uuid({ message: "userId (працівника) має бути UUID" }),
});
//# sourceMappingURL=sensor.dto.js.map