import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Sensor } from "../../types/sensor";
import { ThermometerSun } from "lucide-react";
import mapImg from "../../assets/map.jpg";

interface InteractiveMapProps {
  sensors: Sensor[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ sensors }) => {
  const navigate = useNavigate();
  const [hoveredSensorId, setHoveredSensorId] = useState<string | null>(null);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100 group">
      {/* План супермаркету */}
      <img
        src={mapImg}
        alt="План супермаркету"
        className="w-full h-auto object-cover opacity-80 mix-blend-multiply"
      />

      {/* Оверлей для кращого контрасту */}
      <div className="absolute inset-0 bg-white/40"></div>

      {/* Рендеримо маркери (піни) для кожного датчика */}
      {sensors.map((sensor) => {
        // Якщо позицій немає, ставимо їх у лівий верхній кут або взагалі не малюємо
        if (sensor.pos_x === null || sensor.pos_y === null) return null;

        // Визначаємо колір залежно від статусу та того, чи вийшла температура за норму
        const latestTemp = sensor.readings?.[0]?.temperature;
        const isOutOfBounds =
          latestTemp !== undefined &&
          sensor.zone &&
          (latestTemp < sensor.zone.min_temp ||
            latestTemp > sensor.zone.max_temp);

        let pinColor = "bg-green-500"; // Норма
        if (sensor.status === "INACTIVE") pinColor = "bg-gray-500";
        if (isOutOfBounds) pinColor = "bg-red-500"; // Тривога!

        return (
          <div
            key={sensor.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${sensor.pos_x}%`, top: `${sensor.pos_y}%` }}
            onMouseEnter={() => setHoveredSensorId(sensor.id)}
            onMouseLeave={() => setHoveredSensorId(null)}
            onClick={() => navigate(`/sensors/${sensor.id}`)}
          >
            {/* Анімація пульсації, якщо є тривога */}
            {isOutOfBounds && (
              <div className="absolute -inset-2 bg-red-500/40 rounded-full animate-ping"></div>
            )}

            {/* Сам маркер */}
            <div
              className={`relative flex items-center justify-center w-8 h-8 rounded-full text-white shadow-lg border-2 border-white transition-transform hover:scale-110 ${pinColor}`}
            >
              <ThermometerSun className="w-4 h-4" />
            </div>

            {/* Спливаюча підказка (Tooltip) при наведенні */}
            {hoveredSensorId === sensor.id && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-50">
                <p className="font-bold text-sm mb-1">{sensor.name}</p>
                <p className="text-gray-300 mb-2">{sensor.zone?.name}</p>
                <div className="flex justify-between items-center bg-gray-800 p-1.5 rounded">
                  <span>Поточна T:</span>
                  <span
                    className={`font-bold text-sm ${isOutOfBounds ? "text-red-400" : "text-green-400"}`}
                  >
                    {latestTemp !== undefined ? `${latestTemp}°C` : "—"}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
