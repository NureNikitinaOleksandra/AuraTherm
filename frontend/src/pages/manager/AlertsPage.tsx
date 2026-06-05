import { useEffect, useState } from "react";
import { useAlerts } from "../../hooks/useAlerts";
import { AlertCard } from "../../components/alerts/AlertCard";
import type { AlertStatus } from "../../types/alert";
import { BellRing, Filter, CheckCircle2 } from "lucide-react";

export const AlertsPage = () => {
  const { alerts, isLoading, error, fetchAlerts } = useAlerts();

  // Активний фільтр: за замовчуванням вантажимо все
  const [activeFilter, setActiveFilter] = useState<AlertStatus | "ALL">("ALL");

  // Перезавантажуємо дані щоразу, коли змінюється фільтр
  useEffect(() => {
    fetchAlerts(activeFilter);
  }, [fetchAlerts, activeFilter]);

  // Кнопки для фільтрації
  const filters: { value: AlertStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "Всі тривоги" },
    { value: "NEW", label: "🔴 Нові" },
    { value: "ACKNOWLEDGED", label: "🟠 В роботі" },
    { value: "RESOLVED", label: "🟢 Вирішені" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Шапка сторінки */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <BellRing className="h-8 w-8 text-red-600" />
          </div>
          Журнал інцидентів
        </h1>
        <p className="text-gray-500 mt-2 ml-14">
          Моніторинг критичних подій та реакції персоналу
        </p>
      </div>

      {/* Панель фільтрів */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-2 mb-6">
        <div className="px-3 py-2 flex items-center text-gray-400 border-r border-gray-100">
          <Filter className="h-5 w-5" />
        </div>
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeFilter === filter.value
                ? "bg-primary text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Зона повідомлень про помилки та завантаження */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Стрічка карток (Timeline) */}
      <div className="space-y-4">
        {isLoading ? (
          // Скелетон або лоадер (поки просто текст)
          <div className="text-center py-12 text-gray-400 font-medium">
            Завантаження...
          </div>
        ) : alerts.length > 0 ? (
          alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="inline-block p-4 bg-green-50 rounded-full mb-3">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              Все спокійно
            </h3>
            <p className="text-gray-500">
              За обраним фільтром тривог не знайдено.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
