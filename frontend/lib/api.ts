const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `API error: ${response.status}`
    );
  }

  return response.json();
}


// ============================================================
// Health
// ============================================================

export async function getHealth() {
  return request<{
    status: string;
  }>("/health");
}


// ============================================================
// Users
// ============================================================

export interface CreateUserPayload {
  name: string;
  email: string;
  role: string;
  organization?: string;
  phone?: string;
}

export async function createUser(
  data: CreateUserPayload
) {
  return request("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


// ============================================================
// Apiaries
// ============================================================

export interface CreateApiaryPayload {
  beekeeper_id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
}

export async function createApiary(
  data: CreateApiaryPayload
) {
  return request("/api/hives/apiaries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


// ============================================================
// Hives
// ============================================================

export interface CreateHivePayload {
  apiary_id: string;
  hive_code: string;
  esp32_device_id?: string;
  status?: string;
}

export async function createHive(
  data: CreateHivePayload
) {
  return request("/api/hives", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


export async function getHive(
  hiveId: string
) {
  return request(
    `/api/hives/${hiveId}`
  );
}


// ============================================================
// Sensor data
// ============================================================

export interface SensorReading {
  hive_id: string;
  temperature_c?: number;
  humidity_percent?: number;
  hive_weight_kg?: number;
  sound_level?: number;
  latitude?: number;
  longitude?: number;
  recorded_at?: string;
}

export async function sendSensorReading(
  data: SensorReading
) {
  return request(
    "/api/sensors/data",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function getHives() {
  return request<any[]>("/api/hives");
}

export async function getHiveReadings(hiveId: string) {
  return request<any[]>(`/api/hives/${hiveId}/readings`);
}

