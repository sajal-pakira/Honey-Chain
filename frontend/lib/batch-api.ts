const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

/* =========================================================
   TYPES
========================================================= */

export interface SupplyChainEvent {
  id: string;
  batch_id: string;
  event_type: string;

  actor_id?: string;
  location_name?: string;

  latitude?: number;
  longitude?: number;

  quantity_kg?: number;
  notes?: string;

  blockchain_tx_hash?: string;

  created_at: string;
}

export interface BatchHive {
  id: string;
  hive_code: string;

  esp32_device_id?: string;

  apiary_id: string;
}

export interface BatchBeekeeper {
  id: string;
  name: string;

  organization?: string;
}

export interface BatchDetails {
  /*
   * Normalized frontend ID.
   *
   * The backend may return this as `id`
   * or `batch_id`, so we normalize it here.
   */
  id: string;

  batch_code: string;

  hive_id?: string;
  beekeeper_id?: string;

  harvest_date?: string | null;

  harvested_weight_kg?: number | null;

  honey_type?: string | null;
  floral_source?: string | null;

  status: string;

  blockchain_hash?: string | null;
  blockchain_tx_hash?: string | null;

  qr_token: string;

  created_at: string;

  hive?: BatchHive | null;
  beekeeper?: BatchBeekeeper | null;

  events: SupplyChainEvent[];
}

/*
 * Raw API shape.
 *
 * We intentionally allow both `id` and `batch_id`.
 */
interface RawBatch {
  id?: string | null;
  batch_id?: string | null;

  batch_code?: string | null;

  hive_id?: string | null;
  beekeeper_id?: string | null;

  harvest_date?: string | null;

  harvested_weight_kg?: number | null;

  honey_type?: string | null;
  floral_source?: string | null;

  status?: string | null;

  blockchain_hash?: string | null;
  blockchain_tx_hash?: string | null;

  qr_token?: string | null;

  created_at?: string | null;

  hive?: BatchHive | null;
  beekeeper?: BatchBeekeeper | null;

  events?: SupplyChainEvent[] | null;
}

/* =========================================================
   REQUEST
========================================================= */

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
    const error = await response.text();

    throw new Error(
      error ||
        `API error: ${response.status}`
    );
  }

  return response.json();
}

/* =========================================================
   NORMALIZE BATCH
========================================================= */

function normalizeBatch(
  raw: RawBatch
): BatchDetails {
  /*
   * IMPORTANT:
   *
   * Backend may expose UUID as:
   *
   *   id
   *
   * or:
   *
   *   batch_id
   *
   * Use whichever exists.
   */

  const id =
    raw.id ??
    raw.batch_id ??
    "";

  if (!id) {
    console.error(
      "HoneyChain: batch has no UUID:",
      raw
    );

    throw new Error(
      "Batch response does not contain a valid batch UUID."
    );
  }

  return {
    id,

    batch_code:
      raw.batch_code ?? "Unknown batch",

    hive_id:
      raw.hive_id ?? undefined,

    beekeeper_id:
      raw.beekeeper_id ?? undefined,

    harvest_date:
      raw.harvest_date ?? null,

    harvested_weight_kg:
      raw.harvested_weight_kg ?? null,

    honey_type:
      raw.honey_type ?? null,

    floral_source:
      raw.floral_source ?? null,

    status:
      raw.status ?? "unknown",

    blockchain_hash:
      raw.blockchain_hash ?? null,

    blockchain_tx_hash:
      raw.blockchain_tx_hash ?? null,

    qr_token:
      raw.qr_token ?? "",

    created_at:
      raw.created_at ??
      new Date().toISOString(),

    hive:
      raw.hive ?? null,

    beekeeper:
      raw.beekeeper ?? null,

    events:
      Array.isArray(raw.events)
        ? raw.events
        : [],
  };
}

/* =========================================================
   GET ALL BATCHES
========================================================= */

export async function getBatches(): Promise<
  BatchDetails[]
> {
  const raw =
    await request<RawBatch[]>(
      "/api/batches"
    );

  if (!Array.isArray(raw)) {
    throw new Error(
      "Invalid batch response from API."
    );
  }

  return raw.map(normalizeBatch);
}

/* =========================================================
   GET SINGLE BATCH
========================================================= */

export async function getBatch(
  batchId: string
): Promise<BatchDetails> {
  if (!batchId) {
    throw new Error(
      "Cannot load batch: batch ID is missing."
    );
  }

  const raw =
    await request<RawBatch>(
      `/api/batches/${batchId}`
    );

  return normalizeBatch(raw);
}

/* =========================================================
   BLOCKCHAIN VERIFICATION
========================================================= */

export interface BlockchainVerification {
  batch_id: string;
  batch_code: string;

  verified: boolean;

  reason: string;

  blockchain_tx_hash?: string | null;
}

export async function verifyBatchOnChain(
  batchId: string
): Promise<BlockchainVerification> {
  if (!batchId) {
    throw new Error(
      "Cannot verify batch: batch ID is missing."
    );
  }

  const response = await fetch(
    `${API_URL}/api/batches/${batchId}/verify`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      text ||
        "Unable to verify blockchain proof"
    );
  }

  return response.json();
}