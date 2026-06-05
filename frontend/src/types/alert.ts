export type AlertStatus = "NEW" | "ACKNOWLEDGED" | "RESOLVED";

export interface Alert {
  id: string;
  status: AlertStatus;
  created_at: string;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
  sensor_id: string;
  store_id: string;
  resolved_by_user_id?: string | null;
  sensor: {
    name: string;
    zone: {
      name: string;
    };
  };
  resolvedByUser?: {
    first_name: string;
    last_name: string;
  } | null;
}
