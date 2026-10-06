from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class HoneyBatchCreate(BaseModel):
    hive_id: UUID
    beekeeper_id: UUID
    harvest_date: datetime
    harvested_weight_kg: float = Field(gt=0)
    honey_type: Optional[str] = None
    floral_source: Optional[str] = None


class SupplyChainEventCreate(BaseModel):
    event_type: str
    actor_id: Optional[UUID] = None
    location: Optional[str] = None
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)
    quantity_kg: Optional[float] = Field(default=None, ge=0)
    notes: Optional[str] = None
    occurred_at: Optional[datetime] = None


class SupplyChainEventResponse(BaseModel):
    id: UUID
    batch_id: UUID
    event_type: str
    actor_id: Optional[UUID] = None

    location_name: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None
    quantity_kg: Optional[float] = None
    notes: Optional[str] = None
    blockchain_tx_hash: Optional[str] = None

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BatchHiveResponse(BaseModel):
    id: UUID
    hive_code: str
    esp32_device_id: Optional[str] = None
    apiary_id: UUID

    model_config = ConfigDict(from_attributes=True)


class BatchBeekeeperResponse(BaseModel):
    id: UUID
    name: str
    organization: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class HoneyBatchResponse(BaseModel):
    id: UUID
    batch_code: str
    hive_id: Optional[UUID]
    beekeeper_id: Optional[UUID]
    harvest_date: datetime
    harvested_weight_kg: float
    honey_type: Optional[str]
    floral_source: Optional[str]
    status: str
    blockchain_hash: Optional[str]
    blockchain_tx_hash: Optional[str]
    qr_token: str
    created_at: datetime

    hive: Optional[BatchHiveResponse] = None
    beekeeper: Optional[BatchBeekeeperResponse] = None
    events: list[SupplyChainEventResponse] = Field(
        default_factory=list
    )

    model_config = ConfigDict(from_attributes=True)