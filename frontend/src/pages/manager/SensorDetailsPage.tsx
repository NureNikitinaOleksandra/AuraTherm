import { useParams, useNavigate } from "react-router-dom";
import { useSensorDetails } from "../../hooks/useSensorDetails";
import {
  ArrowLeft,
  ThermometerSun,
  Droplets,
  CloudFog,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const SensorDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sensor, history, isLoading, error, daysFilter, setDaysFilter } =
    useSensorDetails(id);

  // Беремо останній показник з об'єкта sensor,
  // або з історії графіку (якщо там є свіжіші дані)
  const latestReading =
    sensor?.readings?.[0] ||
    (history.length > 0 ? history[history.length - 1] : null);

  // Перевірка, чи температура вийшла за межі норми
  const isOutOfBounds =
    latestReading !== null &&
    sensor?.zone &&
    (latestReading.temperature < sensor.zone.min_temp ||
      latestReading.temperature > sensor.zone.max_temp);

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    if (daysFilter === 1) {
      return date.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg z-50">
          <p className="text-gray-500 text-sm mb-2">
            {new Date(label).toLocaleString("uk-UA", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="font-bold text-sm"
            >
              {entry.name}: {entry.value}{" "}
              {entry.dataKey === "temperature" || entry.dataKey === "dew_point"
                ? "°C"
                : "%"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading && !sensor) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium text-lg">
        Завантаження даних датчика...
      </div>
    );
  }

  if (error || !sensor) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 font-bold text-xl mb-4">
          {error || "Датчик не знайдено"}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline"
        >
          Повернутися назад
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 1. Верхня панель (Без ID, з акцентом на норму Зони) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {sensor.name}
              <span
                className={`text-xs px-2 py-1 rounded-md font-bold uppercase ${
                  sensor.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {sensor.status}
              </span>
            </h1>
            {sensor.location && (
              <p className="text-sm text-gray-500 mt-1">
                📍 Розташування: {sensor.location}
              </p>
            )}
          </div>
        </div>

        {/* НОВИЙ БЛОК: Зона та Норма */}
        {sensor.zone && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center gap-4">
            <MapPin className="h-6 w-6 text-blue-500" />
            <div>
              <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                Зона моніторингу
              </div>
              <div className="text-sm font-bold text-gray-800">
                {sensor.zone.name}
              </div>
            </div>
            <div className="pl-4 ml-2 border-l border-blue-200">
              <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                Норма температури
              </div>
              <div className="text-sm font-bold text-gray-800">
                {sensor.zone.min_temp}°C ... {sensor.zone.max_temp}°C
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Картки поточних показників */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Температура (змінює колір, якщо виходить за межі) */}
        <div
          className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between gap-4 transition-colors ${
            isOutOfBounds
              ? "bg-red-50 border-red-200"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-4 rounded-xl ${isOutOfBounds ? "bg-red-100 text-red-600" : "bg-orange-50 text-orange-500"}`}
            >
              <ThermometerSun className="h-8 w-8" />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${isOutOfBounds ? "text-red-600" : "text-gray-500"}`}
              >
                Поточна Температура
              </p>
              <p
                className={`text-3xl font-bold ${isOutOfBounds ? "text-red-700" : "text-gray-800"}`}
              >
                {latestReading ? `${latestReading.temperature}°C` : "—"}
              </p>
            </div>
          </div>
          {isOutOfBounds && (
            <span
              title="Відхилення від норми!"
              className="flex items-center justify-center"
            >
              <AlertTriangle className="h-8 w-8 text-red-500 animate-pulse" />
            </span>
          )}
        </div>

        {/* Вологість */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-xl text-blue-500">
            <Droplets className="h-8 w-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Вологість</p>
            <p className="text-3xl font-bold text-gray-800">
              {latestReading?.humidity !== undefined &&
              latestReading?.humidity !== null
                ? `${latestReading.humidity}%`
                : "—"}
            </p>
          </div>
        </div>

        {/* Точка роси */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-teal-50 rounded-xl text-teal-500">
            <CloudFog className="h-8 w-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Точка роси</p>
            <p className="text-3xl font-bold text-gray-800">
              {latestReading?.dew_point !== undefined &&
              latestReading?.dew_point !== null
                ? `${latestReading.dew_point}°C`
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Блок з графіком */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-bold text-gray-800">
            Історія показників
          </h2>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {[
              { label: "Сьогодні", value: 1 },
              { label: "7 Днів", value: 7 },
              { label: "30 Днів", value: 30 },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setDaysFilter(f.value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  daysFilter === f.value
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            Оновлення графіка...
          </div>
        ) : history.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            Очікування даних від датчика...
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={history}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickMargin={10}
                  minTickGap={30}
                />
                <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} unit="°" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#9CA3AF"
                  fontSize={12}
                  unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  name="Температура"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  name="Вологість"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="dew_point"
                  name="Точка роси"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
