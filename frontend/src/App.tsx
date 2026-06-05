import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { MainLayout } from "./components/layout/MainLayout";
import { UsersPage } from "./pages/admin/UsersPage";
import { ZonesPage } from "./pages/admin/ZonesPage";
import { AuditLogsPage } from "./pages/admin/AuditLogsPage";
import { SensorsPage } from "./pages/admin/SensorsPage";
import { AlertsPage } from "./pages/manager/AlertsPage";
import { SensorDetailsPage } from "./pages/manager/SensorDetailsPage";
import { MonitoringPage } from "./pages/manager/MonitoringPage";
import { DashboardPage } from "./pages/manager/DashboardPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Загальний захист: пускаємо в MainLayout тільки авторизованих (Адмінів або Менеджерів) */}
          <Route
            element={<ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]} />}
          >
            <Route element={<MainLayout />}>
              {/* ГРУПА МАРШРУТІВ ТІЛЬКИ ДЛЯ АДМІНІСТРАТОРА */}
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/users" element={<UsersPage />} />
                <Route path="/zones" element={<ZonesPage />} />
                <Route path="/sensors" element={<SensorsPage />} />
                <Route path="/audit" element={<AuditLogsPage />} />
              </Route>

              {/* ГРУПА МАРШРУТІВ ТІЛЬКИ ДЛЯ МЕНЕДЖЕРА */}
              <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/monitoring" element={<MonitoringPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/sensors/:id" element={<SensorDetailsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
