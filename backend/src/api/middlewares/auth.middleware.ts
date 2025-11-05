import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env.js";
import prisma from "../../config/db.js";
import type { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  role: string;
  store_id: string;
}

/** Типова перевірка runtime: чи має об'єкт поля id, role, store_id */
function isTokenPayload(obj: unknown): obj is TokenPayload {
  if (!obj || typeof obj !== "object") return false;
  // 'in' працює для перевірки наявності ключів у об'єкті
  return "id" in obj && "role" in obj && "store_id" in obj;
}

// Розширюємо тип 'Request' з Express, щоб додати 'req.user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        store_id: string;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  // 1. Перевіряємо, чи є токен у заголовку Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Витягуємо токен
      token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
      if (!token) {
        return res
          .status(401)
          .json({ message: "Токен відсутній або некоректний" });
      }

      // 3. Перевіряємо токен
      // 1) Приведення через unknown, щоб уникнути помилки типів TS
      const decodedRaw = jwt.verify(token, JWT_SECRET as string) as unknown;

      // 2) Runtime-перевірка: чи має decoded необхідні поля
      if (!isTokenPayload(decodedRaw)) {
        console.error(
          "JWT decoded payload missing required fields:",
          decodedRaw
        );
        return res.status(401).json({ message: "Недійсний токен" });
      }

      const decoded = decodedRaw; // тепер це TokenPayload

      // 4. ВАЖЛИВО! Перевіряємо, чи користувач досі існує
      // (ми не хочемо повний об'єкт User, лише його ID, роль і store_id)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true, store_id: true },
      });

      if (!user) {
        return res.status(401).json({ message: "Користувача не знайдено" });
      }

      // 5. ДОДАЄМО КОРИСТУВАЧА ДО ЗАПИТУ
      // Тепер *кожен* наступний контролер матиме доступ до req.user
      req.user = user;
      next(); // Пропускаємо до наступного кроку (контролера)
    } catch (error) {
      res.status(401).json({ message: "Токен недійсний або прострочений" });
    }
  } else {
    res.status(401).json({ message: "Немає токена, авторизація не пройдена" });
  }
};
