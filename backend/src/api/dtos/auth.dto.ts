import { UserRole } from "@prisma/client";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, { message: "Пароль має бути не менше 6 символів" })
  .regex(/[a-zA-Z]/, {
    message: "Пароль має містити хоча б одну латинську літеру",
  })
  .regex(/[0-9]/, { message: "Пароль має містити хоча б одну цифру" });

export const RegisterAdminSchema = z.object({
  storeName: z.string().min(2, "Назва магазину занадто коротка"),
  adminEmail: z.string().email("Невірний формат email"),
  adminPassword: passwordSchema,
  adminFirstName: z.string().min(2, "Ім’я занадто коротке"),
  adminLastName: z.string().min(2, "Прізвище занадто коротке"),
});
export type RegisterAdminDto = z.infer<typeof RegisterAdminSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Невірний формат email"),
  password: passwordSchema,
});
export type LoginDto = z.infer<typeof LoginSchema>;

export const CreateUserSchema = z.object({
  email: z.string().email("Невірний формат email"),
  password: passwordSchema,
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  patronymic: z.string().optional(),
  role: z.enum(["ADMIN", "MANAGER", "WORKER"]),
});
export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const updateUserSchema = z.object({
  email: z.string().email("Невірний формат email"),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  patronymic: z.string().optional(),
  role: z.enum(["ADMIN", "MANAGER", "WORKER"]),
});
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
});
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
