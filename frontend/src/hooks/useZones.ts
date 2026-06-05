import { useState, useCallback } from "react";
import { zoneService } from "../services/zoneService";
import type { CreateZoneData } from "../services/zoneService";
import type { Zone } from "../types/zone";

export const useZones = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchZones = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await zoneService.getAll();
      setZones(data);
      setError(null);
    } catch (err: any) {
      setError("Не вдалося завантажити список зон");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createZone = async (data: CreateZoneData): Promise<boolean> => {
    setFieldErrors({});
    setError(null);
    try {
      await zoneService.create(data);
      await fetchZones();
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
        setError(err.response?.data?.message || "Помилка при створенні зони");
      }
      return false;
    }
  };

  const editZone = async (
    id: string,
    data: Partial<CreateZoneData>,
  ): Promise<boolean> => {
    setFieldErrors({});
    setError(null);
    try {
      await zoneService.update(id, data);
      await fetchZones();
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
        setError(err.response?.data?.message || "Помилка при оновленні зони");
      }
      return false;
    }
  };

  const removeZone = async (id: string) => {
    try {
      await zoneService.delete(id);
      setZones((prev) => prev.filter((z) => z.id !== id));
      return true;
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Помилка при видаленні. Можливо, є прив'язані датчики.",
      );
      return false;
    }
  };

  // Метод для завантаження деталей однієї зони (з датчиками)
  const fetchZoneDetails = async (id: string): Promise<Zone | null> => {
    try {
      return await zoneService.getById(id);
    } catch (err: any) {
      setError("Не вдалося завантажити деталі зони");
      return null;
    }
  };

  return {
    zones,
    isLoading,
    error,
    fieldErrors,
    fetchZones,
    createZone,
    editZone,
    removeZone,
    fetchZoneDetails,
    setFieldErrors,
    setError,
  };
};
