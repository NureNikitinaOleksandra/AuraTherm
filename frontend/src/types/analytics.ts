export interface AuditLogBasic {
  action: string;
  details: string;
  timestamp: string;
  user_email: string;
}

export interface DashboardStats {
  totalSensors: number;
  activeAlerts: number;
  status: "OK" | "WARNING" | "DANGER";
  recentActivity: AuditLogBasic[];
}
