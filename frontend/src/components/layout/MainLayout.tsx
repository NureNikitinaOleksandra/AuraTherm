import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ThermometerSun,
  Users,
  Map,
  LogOut,
  Settings,
  ClipboardList,
  BellRing,
  LayoutGrid,
  LayoutDashboard,
} from "lucide-react";

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Стиль для активного і неактивного посилання меню
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-white/20 text-white font-bold"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      {/* Верхнє меню (Header) */}
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Логотип */}
            <div className="flex items-center space-x-3">
              <ThermometerSun className="h-8 w-8" />
              <span className="text-xl font-bold tracking-wider">
                AuraTherm
              </span>
            </div>

            {/* Навігація залежно від ролі */}
            <nav className="hidden md:flex space-x-2">
              {user?.role === "ADMIN" && (
                <>
                  <NavLink to="/users" className={navLinkClass}>
                    <Users className="h-5 w-5" />
                    <span>Користувачі</span>
                  </NavLink>
                  <NavLink to="/zones" className={navLinkClass}>
                    <Map className="h-5 w-5" />
                    <span>Зони</span>
                  </NavLink>
                  <NavLink to="/sensors" className={navLinkClass}>
                    <Settings className="h-5 w-5" />
                    <span>Датчики</span>
                  </NavLink>
                  <NavLink to="/audit" className={navLinkClass}>
                    <ClipboardList className="h-5 w-5" />
                    <span>Журнал</span>
                  </NavLink>
                </>
              )}

              {user?.role === "MANAGER" && (
                <>
                  <NavLink to="/" className={navLinkClass}>
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Дашборд</span>
                  </NavLink>
                  <NavLink to="/monitoring" className={navLinkClass}>
                    <LayoutGrid className="h-5 w-5" />
                    <span>Моніторинг</span>
                  </NavLink>
                  <NavLink to="/alerts" className={navLinkClass}>
                    <BellRing className="h-5 w-5" />
                    <span>Тривоги</span>
                  </NavLink>
                </>
              )}
            </nav>

            {/* Профіль та Вихід */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-xs text-white/80">{user?.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Вийти"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Основний контент (сюди будуть підставлятися сторінки) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
