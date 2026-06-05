import { useEffect } from "react";
import { useSensors } from "../../hooks/useSensors";
import { SensorCard } from "../../components/sensors/SensorCard";
import { LayoutGrid, RefreshCw } from "lucide-react";

export const MonitoringPage = () => {
  const { sensors, isLoading, error, fetchSensors } = useSensors();

  useEffect(() => {
    fetchSensors();
  }, [fetchSensors]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Шапка сторінки */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LayoutGrid className="h-8 w-8 text-blue-600" />
            </div>
            Моніторинг обладнання
          </h1>
          <p className="text-gray-500 mt-2 ml-14">
            Поточний стан та показники всіх датчиків у магазині
          </p>
        </div>

        {/* Кнопка ручного оновлення даних */}
        <button
          onClick={() => fetchSensors()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="text-sm font-medium">Оновити дані</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Сітка з картками (3 в рядок на десктопі) */}
      {isLoading && sensors.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-medium text-lg">
          Завантаження датчиків...
        </div>
      ) : sensors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">
            У магазині ще не встановлено жодного датчика.
          </p>
        </div>
      )}
    </div>
  );
};
