import { api } from "./api";
import type { Alert, AlertStatus } from "../types/alert";

export const alertService = {
  // Отримання всіх тривог (з опціональним фільтром)
  getAll: async (status?: AlertStatus | "ALL") => {
    // Якщо статус не передали або вибрали 'ALL', не додаємо його в параметри
    const params = status && status !== "ALL" ? { status } : {};
    const response = await api.get<Alert[]>("/alerts", { params });
    return response.data;
  },

  // Отримання деталей однієї тривоги
  getById: async (id: string) => {
    const response = await api.get<Alert>(`/alerts/${id}`);
    return response.data;
  },
};
