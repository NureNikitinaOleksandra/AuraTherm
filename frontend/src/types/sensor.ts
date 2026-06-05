export type SensorStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface SensorReading {
  id?: string;
  temperature: number;
  humidity?: number | null;
  dew_point?: number | null;
  timestamp: string;
  sensor_id?: string;
}

export interface Sensor {
  id: string;
  name: string;
  location?: string | null;
  pos_x?: number | null;
  pos_y?: number | null;
  status: SensorStatus;
  zone_id: string;
  store_id: string;
  // Зона з лімітами
  zone?: {
    id: string;
    name: string;
    min_temp: number;
    max_temp: number;
    store_id: string;
  };
  // Працівники, прикріплені до датчика
  assignedTo?: {
    user: {
      id: string;
      first_name: string;
      last_name: string;
    };
  }[];
  // Масив з останнім показником (або історією)
  readings?: SensorReading[];
}
