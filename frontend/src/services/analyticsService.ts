import { api } from "./api";
import type { SensorReading } from "../types/sensor";
import type { DashboardStats } from "../types/analytics";

export const analyticsService = {
  // Отримання історії датчика за кількість днів
  getSensorHistory: async (sensorId: string, days: number = 1) => {
    const response = await api.get<SensorReading[]>(
      `/analytics/sensor/${sensorId}/history`,
      {
        params: { days },
      },
    );
    return response.data;
  },

  // Отримання статистики для дашборду
  getDashboardStats: async () => {
    // Перевір, чи такий маршрут на твоєму бекенді. Зазвичай це /analytics/dashboard
    const response = await api.get<DashboardStats>("/analytics/dashboard");
    return response.data;
  },

  // Завантаження PDF
  downloadDailyReport: async () => {
    // ВАЖЛИВО: responseType: 'blob' вказує Axios, що ми качаємо файл, а не JSON
    const response = await api.get("/analytics/reports/daily/download", {
      responseType: "blob",
    });

    // Створюємо віртуальне посилання для завантаження файлу
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `AuraTherm_Report_${new Date().toLocaleDateString("uk-UA")}.pdf`,
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  },
};
