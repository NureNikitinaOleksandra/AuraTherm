import { useState, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";
import type { DashboardStats } from "../types/analytics";

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err: any) {
      setError("Не вдалося завантажити статистику");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadReport = async () => {
    setIsDownloading(true);
    try {
      await analyticsService.downloadDailyReport();
    } catch (err) {
      alert("Помилка при генерації звіту");
    } finally {
      setIsDownloading(false);
    }
  };

  return { stats, isLoading, isDownloading, error, fetchStats, downloadReport };
};
