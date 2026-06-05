import { api } from "./api";
import type { Zone } from "../types/zone";

export interface CreateZoneData {
  name: string;
  min_temp: number;
  max_temp: number;
}

export const zoneService = {
  getAll: async () => {
    const response = await api.get<Zone[]>("/zones");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Zone>(`/zones/${id}`);
    return response.data;
  },

  create: async (data: CreateZoneData) => {
    const response = await api.post<Zone>("/zones", data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateZoneData>) => {
    const response = await api.put<Zone>(`/zones/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/zones/${id}`);
  },
};
