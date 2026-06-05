import { useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { useSensors } from "../../hooks/useSensors"; // Потрібно для карти
import { InteractiveMap } from "../../components/map/InteractiveMap";
import {
  Activity,
  BellRing,
  Download,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

export const DashboardPage = () => {
  const { stats, isLoading, isDownloading, fetchStats, downloadReport } =
    useDashboard();
  const { sensors, fetchSensors } = useSensors();

  useEffect(() => {
    fetchStats();
    fetchSensors();
  }, [fetchStats, fetchSensors]);

  if (isLoading || !stats) {
    return (
      <div className="text-center py-20 text-gray-500">
        Завантаження дашборду...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 1. Заголовок та кнопка Звіту */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            Головна панель
          </h1>
          <p className="text-gray-500 mt-1">
            Огляд системи AuraTherm у реальному часі
          </p>
        </div>

        <button
          onClick={downloadReport}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-primary hover:bg-primaryDark text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-primary/30 transition-all disabled:opacity-70 disabled:animate-pulse"
        >
          <Download className="h-5 w-5" />
          {isDownloading ? "Генерація PDF..." : "Завантажити звіт"}
        </button>
      </div>

      {/* 2. KPI Картки (Верхній ряд) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Загальний статус */}
        <div
          className={`p-6 rounded-2xl shadow-sm border ${
            stats.status === "WARNING" || stats.activeAlerts > 0
              ? "bg-orange-50 border-orange-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                Статус системи
              </p>
              <h2
                className={`text-2xl font-black mt-1 ${stats.activeAlerts > 0 ? "text-orange-700" : "text-green-700"}`}
              >
                {stats.activeAlerts > 0 ? "УВАГА" : "В НОРМІ"}
              </h2>
            </div>
            {stats.activeAlerts > 0 ? (
              <ShieldAlert className="h-10 w-10 text-orange-500" />
            ) : (
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            )}
          </div>
        </div>

        {/* Активні тривоги */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                Активні тривоги
              </p>
              <h2 className="text-3xl font-black text-gray-800 mt-1">
                {stats.activeAlerts}
              </h2>
            </div>
            <div className="p-3 bg-red-50 rounded-xl text-red-500">
              <BellRing className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Всього датчиків */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                Датчиків у мережі
              </p>
              <h2 className="text-3xl font-black text-gray-800 mt-1">
                {stats.totalSensors}
              </h2>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Інтерактивна карта (W-M-1) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Карта супермаркету
          </h2>
          <div className="flex gap-4 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span> Норма
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>{" "}
              Тривога
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-gray-500"></span>{" "}
              Вимкнено
            </span>
          </div>
        </div>

        {/* Передаємо список датчиків у компонент карти */}
        <InteractiveMap sensors={sensors} />
      </div>
    </div>
  );
};
