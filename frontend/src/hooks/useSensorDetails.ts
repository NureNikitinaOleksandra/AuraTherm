import { useState, useCallback, useEffect } from "react";
import { sensorService } from "../services/sensorService";
import { analyticsService } from "../services/analyticsService";
import type { Sensor, SensorReading } from "../types/sensor";

export const useSensorDetails = (sensorId: string | undefined) => {
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daysFilter, setDaysFilter] = useState<number>(1); // За замовчуванням 1 день (Сьогодні)

  const fetchData = useCallback(async () => {
    if (!sensorId) return;
    setIsLoading(true);
    try {
      // Робимо два запити паралельно для швидкості
      const [sensorData, historyData] = await Promise.all([
        sensorService.getById(sensorId),
        analyticsService.getSensorHistory(sensorId, daysFilter),
      ]);
      setSensor(sensorData);
      setHistory(historyData);
      setError(null);
    } catch (err: any) {
      setError("Не вдалося завантажити деталі датчика");
    } finally {
      setIsLoading(false);
    }
  }, [sensorId, daysFilter]);

  // Завантажуємо дані при зміні ID або фільтра днів
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    sensor,
    history,
    isLoading,
    error,
    daysFilter,
    setDaysFilter,
    refresh: fetchData,
  };
};
