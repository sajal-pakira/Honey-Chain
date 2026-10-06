-- ============================================================
-- HONEYCHAIN DATABASE
-- PostgreSQL / Supabase
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'beekeeper',
    'processor',
    'distributor',
    'admin'
);

CREATE TYPE batch_status AS ENUM (
    'created',
    'harvested',
    'processing',
    'packaged',
    'in_transit',
    'delivered',
    'verified'
);

CREATE TYPE event_type AS ENUM (
    'harvest',
    'processing',
    'packaging',
    'shipment',
    'delivery'
);


-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(150) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    role user_role NOT NULL,

    organization VARCHAR(255),

    phone VARCHAR(30),

    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- APIARIES
-- ============================================================

CREATE TABLE apiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    beekeeper_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    name VARCHAR(150) NOT NULL,

    latitude DOUBLE PRECISION,

    longitude DOUBLE PRECISION,

    location_name VARCHAR(255),

    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- HIVES
-- ============================================================

CREATE TABLE hives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    apiary_id UUID NOT NULL
        REFERENCES apiaries(id)
        ON DELETE CASCADE,

    hive_code VARCHAR(100) UNIQUE NOT NULL,

    esp32_device_id VARCHAR(150) UNIQUE,

    status VARCHAR(50) DEFAULT 'active',

    installed_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- SENSOR READINGS
-- ============================================================

CREATE TABLE sensor_readings (
    id BIGSERIAL PRIMARY KEY,

    hive_id UUID NOT NULL
        REFERENCES hives(id)
        ON DELETE CASCADE,

    temperature_c DOUBLE PRECISION,

    hive_weight_kg DOUBLE PRECISION,

    vibration_level DOUBLE PRECISION,

    sound_level DOUBLE PRECISION,

    latitude DOUBLE PRECISION,

    longitude DOUBLE PRECISION,

    recorded_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- HIVE HEALTH / AI ANALYSIS
-- ============================================================

CREATE TABLE hive_health_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    hive_id UUID NOT NULL
        REFERENCES hives(id)
        ON DELETE CASCADE,

    health_score DOUBLE PRECISION,

    activity_score DOUBLE PRECISION,

    abnormal_activity BOOLEAN DEFAULT FALSE,

    disease_risk DOUBLE PRECISION,

    honey_yield_prediction_kg DOUBLE PRECISION,

    analysis_summary TEXT,

    model_version VARCHAR(100),

    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- HONEY BATCHES
-- ============================================================

CREATE TABLE honey_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    batch_code VARCHAR(100) UNIQUE NOT NULL,

    hive_id UUID NOT NULL
        REFERENCES hives(id),

    beekeeper_id UUID NOT NULL
        REFERENCES users(id),

    harvest_date TIMESTAMPTZ,

    harvested_weight_kg DOUBLE PRECISION NOT NULL,

    honey_type VARCHAR(150),

    floral_source VARCHAR(255),

    status batch_status DEFAULT 'created',

    blockchain_hash VARCHAR(255),

    blockchain_tx_hash VARCHAR(255),

    qr_token VARCHAR(255) UNIQUE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- SUPPLY CHAIN EVENTS
-- ============================================================

CREATE TABLE supply_chain_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    batch_id UUID NOT NULL
        REFERENCES honey_batches(id)
        ON DELETE CASCADE,

    event_type event_type NOT NULL,

    actor_id UUID
        REFERENCES users(id),

    location_name VARCHAR(255),

    latitude DOUBLE PRECISION,

    longitude DOUBLE PRECISION,

    quantity_kg DOUBLE PRECISION,

    notes TEXT,

    blockchain_tx_hash VARCHAR(255),

    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- ROYALTY RECORDS
-- ============================================================

CREATE TABLE royalty_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    batch_id UUID NOT NULL
        REFERENCES honey_batches(id)
        ON DELETE CASCADE,

    beekeeper_id UUID NOT NULL
        REFERENCES users(id),

    transaction_value NUMERIC(12,2),

    royalty_percentage NUMERIC(5,2),

    royalty_amount NUMERIC(12,2),

    blockchain_tx_hash VARCHAR(255),

    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_hives_apiary
ON hives(apiary_id);

CREATE INDEX idx_sensor_hive_time
ON sensor_readings(hive_id, recorded_at DESC);

CREATE INDEX idx_analysis_hive
ON hive_health_analysis(hive_id, created_at DESC);

CREATE INDEX idx_batches_beekeeper
ON honey_batches(beekeeper_id);

CREATE INDEX idx_batches_status
ON honey_batches(status);

CREATE INDEX idx_supply_chain_batch
ON supply_chain_events(batch_id, created_at);

CREATE INDEX idx_royalty_batch
ON royalty_records(batch_id);


-- ============================================================
-- USEFUL VIEW:
-- LATEST SENSOR READING FOR EACH HIVE
-- ============================================================

CREATE VIEW latest_hive_readings AS
SELECT DISTINCT ON (hive_id)
    hive_id,
    temperature_c,
    hive_weight_kg,
    vibration_level,
    sound_level,
    latitude,
    longitude,
    recorded_at
FROM sensor_readings
ORDER BY hive_id, recorded_at DESC;


-- ============================================================
-- USEFUL VIEW:
-- COMPLETE BATCH OVERVIEW
-- ============================================================

CREATE VIEW batch_overview AS
SELECT
    b.id,
    b.batch_code,
    b.harvest_date,
    b.harvested_weight_kg,
    b.honey_type,
    b.floral_source,
    b.status,

    u.name AS beekeeper_name,

    h.hive_code,

    b.blockchain_hash,
    b.blockchain_tx_hash,

    b.created_at

FROM honey_batches b

JOIN users u
    ON b.beekeeper_id = u.id

JOIN hives h
    ON b.hive_id = h.id;