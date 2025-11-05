import type { Request, Response, NextFunction } from "express";

export const checkRole = (role: "ADMIN" | "MANAGER" | "WORKER") => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ми очікуємо, що цей middleware ЗАВЖДИ запускається ПІСЛЯ 'protect'
    if (!req.user) {
      return res.status(401).json({ message: "Помилка авторизації" });
    }

    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Доступ заборонено (недостатньо прав)" });
    }

    next();
  };
};

// Окремий охоронець для Адміна (для зручності)
export const isAdmin = checkRole("ADMIN");
