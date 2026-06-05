export interface SensorBasic {
  id: string;
  name: string;
  status: string;
}

export interface Zone {
  id: string;
  name: string;
  min_temp: number;
  max_temp: number;
  store_id: string;
  _count?: {
    sensors: number;
  };
  sensors?: SensorBasic[]; // Це поле приходить, коли викликається функція getById
}
