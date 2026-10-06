from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


# ============================================================
# APIARY SCHEMAS
# ============================================================

class ApiaryCreate(BaseModel):
    """
    Data required to create an apiary.
    """

    beekeeper_id: UUID

    name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

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

    location_name: Optional[str] = Field(
        default=None,
        max_length=255,
    )


class ApiaryResponse(BaseModel):
    """
    API response for an apiary.
    """

    id: UUID
    beekeeper_id: UUID
    name: str

    latitude: Optional[float]
    longitude: Optional[float]

    location_name: Optional[str]
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# HIVE SCHEMAS
# ============================================================

class HiveCreate(BaseModel):
    """
    Data required to register a hive and its ESP32 device.
    """

    apiary_id: UUID

    hive_code: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    esp32_device_id: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    status: str = Field(
        default="active",
        max_length=50,
    )


class HiveResponse(BaseModel):
    """
    API response for a hive.
    """

    id: UUID
    apiary_id: UUID

    hive_code: str
    esp32_device_id: Optional[str]

    status: str
    installed_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )