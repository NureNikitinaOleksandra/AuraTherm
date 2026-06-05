import React from "react";
import { Link } from "react-router-dom";
import type { Sensor } from "../../types/sensor";
import { ThermometerSun, MapPin, AlertCircle } from "lucide-react";

interface SensorCardProps {
  sensor: Sensor;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const latestReading = sensor.readings?.[0];

  // Кольори для статусів
  const statusColors = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-500",
    MAINTENANCE: "bg-orange-100 text-orange-700",
  };

  const isInactive = sensor.status === "INACTIVE";

  return (
    <Link
      to={`/sensors/${sensor.id}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-primary/30 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">
            {sensor.name}
          </h3>
          <div className="flex items-center text-xs text-gray-500 mt-1.5">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="truncate max-w-[150px]">
              {sensor.zone?.name || "Без зони"}
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${statusColors[sensor.status]}`}
        >
          {sensor.status}
        </span>
      </div>

      <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl transition-colors ${
              isInactive
                ? "bg-gray-50 text-gray-400"
                : "bg-red-50 text-red-500 group-hover:bg-red-100"
            }`}
          >
            <ThermometerSun className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-medium mb-0.5 uppercase tracking-wider">
              Температура
            </p>
            <div className="flex items-baseline gap-1">
              <p
                className={`text-2xl font-bold ${isInactive ? "text-gray-400" : "text-gray-800"}`}
              >
                {latestReading ? `${latestReading.temperature}` : "—"}
              </p>
              {latestReading && (
                <span className="text-gray-500 font-medium">°C</span>
              )}
            </div>
          </div>
        </div>

        {/* Якщо датчик онлайн, але немає даних */}
        {!latestReading && !isInactive && (
          <div
            title="Немає свіжих даних"
            className="text-orange-400 animate-pulse"
          >
            <AlertCircle className="h-5 w-5" />
          </div>
        )}
      </div>
    </Link>
  );
};
