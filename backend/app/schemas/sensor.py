from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class SensorDataCreate(BaseModel):
    """
    Sensor payload received from the HoneyChain ESP32.
    """

    hive_id: UUID

    # DHT22
    temperature_c: Optional[float] = Field(
        default=None,
        ge=-20,
        le=80,
        description="Temperature in Celsius",
    )

    humidity_percent: Optional[float] = Field(
        default=None,
        ge=0,
        le=100,
        description="Relative humidity percentage",
    )

    # HX711 + 10 kg load cell
    hive_weight_kg: Optional[float] = Field(
        default=None,
        ge=0,
        le=10,
        description="Hive/load-cell weight in kilograms",
    )

    # INMP441
    sound_level: Optional[float] = Field(
        default=None,
        ge=0,
        description="Processed acoustic activity value",
    )

    # GPS
    latitude: Optional[float] = Field(
        default=None,
        ge=-90,
        le=90,
    )

    longitude: Optional[float] = Field(
        default=None,
        ge=-180,
        le=180,
    )

    recorded_at: Optional[datetime] = None


class SensorDataResponse(BaseModel):
    """
    Stored sensor reading returned by HoneyChain.
    """

    id: int
    hive_id: UUID

    temperature_c: Optional[float]
    humidity_percent: Optional[float]
    hive_weight_kg: Optional[float]
    sound_level: Optional[float]

    latitude: Optional[float]
    longitude: Optional[float]

    recorded_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )