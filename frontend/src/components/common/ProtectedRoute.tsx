import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Наприклад: ['ADMIN', 'MANAGER']
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // Якщо немає токену -> відправляємо на логін
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Якщо роль не підходить -> "розумне" перенаправлення
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Якщо це Адміністратор, який зайшов на територію Менеджера
    if (user.role === "ADMIN") {
      return <Navigate to="/users" replace />;
    }

    // Якщо це Менеджер, який зайшов на територію Адміністратора
    if (user.role === "MANAGER") {
      return <Navigate to="/" replace />;
    }

    // Для будь-яких інших непередбачених випадків (наприклад, WORKER)
    return <Navigate to="/login" replace />;
  }

  // Якщо все ок -> показуємо сторінку (Outlet - це місце, куди підставиться сторінка)
  return <Outlet />;
};
