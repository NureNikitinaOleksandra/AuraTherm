import { useState, useCallback } from "react";
import { sensorService } from "../services/sensorService";
import type { CreateSensorData } from "../services/sensorService";
import type { Sensor } from "../types/sensor";

export const useSensors = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchSensors = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await sensorService.getAll();
      setSensors(data);
      setError(null);
    } catch (err: any) {
      setError("Не вдалося завантажити список датчиків");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSensor = async (
    data: CreateSensorData,
  ): Promise<Sensor | null> => {
    setFieldErrors({});
    setError(null);
    try {
      const newSensor = await sensorService.create(data);
      return newSensor;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const zodErrors = err.response.data.errors;
        const formattedErrors: Record<string, string> = {};
        for (const key in zodErrors) {
          formattedErrors[key] = zodErrors[key][0];
        }
        setFieldErrors(formattedErrors);
      } else {
        setError(
          err.response?.data?.message || "Помилка при створенні датчика",
        );
      }
      return null;
    }
  };

  const editSensor = async (
    id: string,
    data: Partial<CreateSensorData>,
  ): Promise<boolean> => {
    setFieldErrors({});
    setError(null);
    try {
      await sensorService.update(id, data);
      await fetchSensors();
      return true;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const zodErrors = err.response.data.errors;
        const formattedErrors: Record<string, string> = {};
        for (const key in zodErrors) {
          formattedErrors[key] = zodErrors[key][0];
        }
        setFieldErrors(formattedErrors);
      } else {
        setError(
          err.response?.data?.message || "Помилка при оновленні датчика",
        );
      }
      return false;
    }
  };

  const assignWorker = async (sensorId: string, userId: string) => {
    try {
      await sensorService.assign(sensorId, userId);
      return true;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Не вдалося призначити працівника",
      );
      return false;
    }
  };

  const removeSensor = async (id: string) => {
    try {
      await sensorService.delete(id);
      setSensors((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Помилка при видаленні датчика");
      return false;
    }
  };

  return {
    sensors,
    isLoading,
    error,
    fieldErrors,
    fetchSensors,
    createSensor,
    editSensor,
    removeSensor,
    assignWorker,
    setFieldErrors,
    setError,
  };
};
