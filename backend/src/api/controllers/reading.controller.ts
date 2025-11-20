import type { Request, Response, NextFunction } from "express";
import * as readingService from "../services/reading.service.js";
import { z } from "zod";

// Схема валидації вхідних даних (імітуємо пакет від датчика)
export const readingSchema = z.object({
  sensorId: z.string().uuid(),
  temperature: z.number(),
});

export const simulate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sensorId, temperature } = req.body;

    await readingService.processReading(sensorId, temperature);

    res.status(200).json({ message: "Data processed successfully" });
  } catch (error) {
    next(error);
  }
};
