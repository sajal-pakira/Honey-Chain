export type UserRole =
  | "beekeeper"
  | "processor"
  | "distributor"
  | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  phone?: string;
}

export interface Apiary {
  id: string;
  name: string;
  location?: string;
  beekeeper_id: string;
}

export interface Hive {
  id: string;
  hive_code: string;
  apiary_id: string;
  esp32_device_id?: string;
  status: string;
}

export interface SensorReading {
  id: number;
  hive_id: string;
  temperature_c?: number;
  humidity_percent?: number;
  hive_weight_kg?: number;
  sound_level?: number;
  latitude?: number;
  longitude?: number;
  recorded_at: string;
}