import { api } from "./api";
import type { AuditLog } from "../types/audit";

export const auditService = {
  getAll: async () => {
    const response = await api.get<AuditLog[]>("/audit-logs");
    return response.data;
  },
};
