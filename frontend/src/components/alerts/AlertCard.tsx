import React from "react";
import { Link } from "react-router-dom";
import type { Alert } from "../../types/alert";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  User,
  MapPin,
  Timer,
} from "lucide-react";

interface AlertCardProps {
  alert: Alert;
}

// Функція для красивого форматування різниці в часі
const formatTimeDiff = (start: string, end: string) => {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "менше хвилини";
  if (diffMins < 60) return `${diffMins} хв`;

  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours} год ${mins} хв`;
};

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  // Форматуємо дату
  const dateObj = new Date(alert.created_at);
  const time = dateObj.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = dateObj.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Налаштовуємо стилі залежно від статусу
  const statusStyles = {
    NEW: {
      bg: "bg-red-50 border-red-200",
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      text: "text-red-700",
      label: "Нова тривога",
      ring: "ring-red-500 shadow-red-100",
    },
    ACKNOWLEDGED: {
      bg: "bg-orange-50 border-orange-200",
      icon: <Clock className="h-6 w-6 text-orange-500" />,
      text: "text-orange-700",
      label: "В роботі",
      ring: "ring-transparent",
    },
    RESOLVED: {
      bg: "bg-green-50 border-green-200",
      icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      text: "text-green-700",
      label: "Вирішено",
      ring: "ring-transparent",
    },
  };

  const style = statusStyles[alert.status];

  // Вираховуємо час реакції
  let responseTimeText = null;
  if (alert.status === "ACKNOWLEDGED" && alert.acknowledged_at) {
    responseTimeText = `Реакція за: ${formatTimeDiff(alert.created_at, alert.acknowledged_at)}`;
  } else if (alert.status === "RESOLVED" && alert.resolved_at) {
    responseTimeText = `Вирішено за: ${formatTimeDiff(alert.created_at, alert.resolved_at)}`;
  }

  return (
    <Link
      to={`/sensors/${alert.sensor_id}`} // Перехід на сторінку датчика
      className={`block flex flex-col sm:flex-row p-5 rounded-xl border ${style.bg} ${alert.status === "NEW" ? `shadow-md ring-1 ${style.ring}` : "shadow-sm"} transition-all duration-300 hover:shadow-md cursor-pointer`}
    >
      <div className="flex sm:flex-col items-center sm:items-start justify-between sm:w-32 shrink-0 mb-4 sm:mb-0 sm:pr-4 sm:border-r border-gray-200/50">
        <div className="flex items-center gap-2">
          {style.icon}
          <span className={`font-bold ${style.text} sm:hidden`}>
            {style.label}
          </span>
        </div>
        <div className="text-right sm:text-left sm:mt-2">
          <div className="text-lg font-bold text-gray-800">{time}</div>
          <div className="text-xs text-gray-500">{date}</div>
        </div>
      </div>

      <div className="flex-1 sm:pl-6 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <MapPin className="h-4 w-4" />
          <span>{alert.sensor.zone.name}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Датчик: {alert.sensor.name}
        </h3>

        <div className="flex flex-wrap gap-2 mt-1">
          {alert.resolvedByUser && (
            <div className="flex items-center gap-1.5 text-xs bg-white/60 px-2 py-1 rounded-md border border-gray-200/50">
              <User className="h-3 w-3 text-gray-500" />
              <span className="text-gray-700">
                Працівник:{" "}
                <span className="font-medium">
                  {alert.resolvedByUser.last_name}
                </span>
              </span>
            </div>
          )}

          {/* Час реакції */}
          {responseTimeText && (
            <div className="flex items-center gap-1.5 text-xs bg-white/60 px-2 py-1 rounded-md border border-gray-200/50">
              <Timer className="h-3 w-3 text-gray-500" />
              <span className="text-gray-700 font-medium">
                {responseTimeText}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center shrink-0 pl-4">
        <span
          className={`px-4 py-2 rounded-lg font-bold text-sm bg-white/80 border ${style.text} ${style.bg.split(" ")[1]}`}
        >
          {style.label}
        </span>
      </div>
    </Link>
  );
};
