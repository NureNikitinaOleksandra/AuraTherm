import { z } from "zod";

// Схема для СТВОРЕННЯ (Admin)
export const createZoneSchema = z
  .object({
    name: z.string().min(1, { message: "Ім'я зони не може бути порожнім" }),
    min_temp: z
      .number()
      .min(-100, { message: "Температура не може бути нижче -100°C" })
      .max(100, { message: "Температура не може бути вище 100°C" }),
    max_temp: z
      .number()
      .min(-100, { message: "Температура не може бути нижче -100°C" })
      .max(100, { message: "Температура не може бути вище 100°C" }),
  })
  .refine((data) => data.max_temp > data.min_temp, {
    message: "Максимальна температура має бути більшою за мінімальну",
    path: ["max_temp"],
  });
export type CreateZoneDto = z.infer<typeof createZoneSchema>;

// Схема для ОНОВЛЕННЯ (Admin)
// Всі поля стають опціональними
export const updateZoneSchema = createZoneSchema.partial();
export type UpdateZoneDto = z.infer<typeof updateZoneSchema>;
