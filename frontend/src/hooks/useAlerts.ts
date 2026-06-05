import { useState, useCallback } from "react";
import { alertService } from "../services/alertService";
import type { Alert, AlertStatus } from "../types/alert";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(
    async (status: AlertStatus | "ALL" = "ALL") => {
      setIsLoading(true);
      try {
        const data = await alertService.getAll(status);
        setAlerts(data);
        setError(null);
      } catch (err: any) {
        setError("Не вдалося завантажити список тривог");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { alerts, isLoading, error, fetchAlerts };
};
