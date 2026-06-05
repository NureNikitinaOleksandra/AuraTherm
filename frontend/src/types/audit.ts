export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user_email: string;
  user_id?: string | null;
  user?: {
    first_name: string;
    last_name: string;
  } | null;
}
