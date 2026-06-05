import { api } from "./api";
import type { Sensor, SensorStatus } from "../types/sensor";

export interface CreateSensorData {
  name: string;
  location?: string;
  pos_x?: number | null;
  pos_y?: number | null;
  status?: SensorStatus;
  zone_id: string;
}

export const sensorService = {
  getAll: async () => {
    const response = await api.get<Sensor[]>("/sensors");
    return response.data;
  },

  create: async (data: CreateSensorData) => {
    const response = await api.post<Sensor>("/sensors", data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSensorData>) => {
    const response = await api.put<Sensor>(`/sensors/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/sensors/${id}`);
  },

  assign: async (sensorId: string, userId: string) => {
    const response = await api.post(`/sensors/${sensorId}/assign`, { userId });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Sensor>(`/sensors/${id}`);
    return response.data;
  },
};
