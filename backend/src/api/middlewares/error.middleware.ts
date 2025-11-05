import type { Request, Response, NextFunction } from "express";

/**
 * Глобальний обробник помилок.
 * Він ловить усі помилки, які виникли у контролерах або сервісах.
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // Якщо помилка є об’єктом типу Error
  if (err instanceof Error) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Якщо це щось інше (наприклад, рядок або null)
  res.status(500).json({
    status: "error",
    message: String(err),
  });
};
