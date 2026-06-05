import { useState, useCallback } from "react";
import { auditService } from "../services/auditService";
import type { AuditLog } from "../types/audit";

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await auditService.getAll();
      setLogs(data);
      setError(null);
    } catch (err: any) {
      setError("Не вдалося завантажити журнал аудиту");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { logs, isLoading, error, fetchLogs };
};
