export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  patronymic?: string;
  role: "ADMIN" | "MANAGER" | "WORKER";
  store_id: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
