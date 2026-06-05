import { api } from "./api";
import type { User } from "../types/auth";

// Інтерфейс для створення користувача (відповідає CreateUserDto)
export interface CreateUserData {
  email: string;
  password?: string; // Робимо опціональним, бо для update він не потрібен
  firstName: string;
  lastName: string;
  patronymic?: string;
  role: "ADMIN" | "MANAGER" | "WORKER";
}

export interface UpdateUserData {
  email: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  role: "ADMIN" | "MANAGER" | "WORKER";
}

export const userService = {
  // Отримати всіх користувачів
  getAll: async () => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  // Створити користувача
  create: async (data: CreateUserData) => {
    const response = await api.post<User>("/users", data);
    return response.data;
  },

  // Редагувати користувача
  update: async (id: string, data: UpdateUserData) => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  // Видалити користувача
  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  },
};
