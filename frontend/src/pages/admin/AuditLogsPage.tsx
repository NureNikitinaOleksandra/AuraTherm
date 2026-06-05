import { useEffect, useState, useMemo } from "react";
import { useAuditLogs } from "../../hooks/useAuditLogs";
import { DataTable } from "../../components/common/DataTable";
import type { Column } from "../../components/common/DataTable";
import type { AuditLog } from "../../types/audit";
import { Filter, ClipboardList } from "lucide-react";

export const AuditLogsPage = () => {
  const { logs, isLoading, error, fetchLogs } = useAuditLogs();

  // Стан для фільтра
  const [selectedAction, setSelectedAction] = useState<string>("ALL");

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Динамічно дістаємо всі унікальні типи дій (actions) з масиву логів для нашого <select>
  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map((log) => log.action));
    return Array.from(actions).sort();
  }, [logs]);

  // Фільтруємо логи без запиту до сервера
  const filteredLogs = useMemo(() => {
    if (selectedAction === "ALL") return logs;
    return logs.filter((log) => log.action === selectedAction);
  }, [logs, selectedAction]);

  // Конфігурація колонок для нашої універсальної DataTable
  const logColumns: Column<AuditLog>[] = [
    {
      header: "Дата та час",
      render: (log) => (
        <span className="text-gray-600 whitespace-nowrap text-sm">
          {new Date(log.timestamp).toLocaleString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      ),
    },
    {
      header: "Ініціатор",
      render: (log) => (
        <div>
          <div className="font-medium text-gray-800">
            {/* Якщо юзер є в базі - пишемо ПІБ, якщо видалений - пишемо Невідомий */}
            {log.user
              ? `${log.user.last_name} ${log.user.first_name}`
              : "Видалений користувач"}
          </div>
          <div className="text-xs text-gray-500">{log.user_email}</div>
        </div>
      ),
    },
    {
      header: "Дія (Action)",
      render: (log) => (
        <span className="bg-gray-100 border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold font-mono">
          {log.action}
        </span>
      ),
    },
    {
      header: "Деталі",
      render: (log) => (
        <span className="text-gray-600 text-sm">{log.details}</span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          Системний журнал
        </h1>

        {/* Фільтр по Action */}
        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-full sm:w-auto">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer w-full"
          >
            <option value="ALL">Всі дії</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Універсальна таблиця */}
      <DataTable
        columns={logColumns}
        data={filteredLogs}
        keyExtractor={(log) => log.id}
        isLoading={isLoading}
      />
    </div>
  );
};
