// src/api/services/auth.service.ts
import prisma from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env.js";
import type { RegisterAdminDto, LoginDto } from "../dtos/auth.dto.js";

// --- Логіка "Супер-Адміна": Створення Store + Admin в одній транзакції ---
export const registerSuperAdmin = async (data: RegisterAdminDto) => {
  const {
    storeName,
    adminEmail,
    adminPassword,
    adminFirstName,
    adminLastName,
  } = data;

  // 1. Хешуємо пароль
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // 2. Використовуємо ТРАНЗАКЦІЮ
  const result = await prisma.$transaction(async (tx) => {
    // а) Створюємо Магазин
    const newStore = await tx.store.create({
      data: {
        name: storeName,
      },
    });

    // б) Створюємо Адміна і прив'язуємо його до магазину
    const newAdmin = await tx.user.create({
      data: {
        email: adminEmail,
        password_hash: hashedPassword,
        first_name: adminFirstName,
        last_name: adminLastName,
        role: "ADMIN",
        store_id: newStore.id,
      },
    });

    return { store: newStore, admin: newAdmin };
  });

  // Видаляємо пароль з відповіді
  delete (result.admin as any).password_hash;
  return result;
};

// --- Логіка Входу (для всіх) ---
export const login = async (data: LoginDto) => {
  // 1. Знайти користувача
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    throw new Error("Неправильний email або пароль");
  }

  // 2. Перевірити пароль
  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password_hash
  );
  if (!isPasswordValid) {
    throw new Error("Неправильний email або пароль");
  }

  // 3. Створити Токен (JWT)
  // ВАЖЛИВО: В токені ми зберігаємо все, що потрібно для ідентифікації
  // Кожен запит буде містити цю інформацію
  const tokenPayload = {
    id: user.id,
    role: user.role,
    store_id: user.store_id,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: "1d", // Токен дійсний 1 день
  });

  return { token: token };
};
