from sqlalchemy import (
    Column,
    Float,
    DateTime,
    ForeignKey,
    BigInteger,
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    hive_id = Column(
        UUID(as_uuid=True),
        ForeignKey("hives.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # DHT22
    temperature_c = Column(
        Float,
        nullable=True,
    )

    humidity_percent = Column(
        Float,
        nullable=True,
    )

    # HX711 + 10 kg load cell
    hive_weight_kg = Column(
        Float,
        nullable=True,
    )

    # INMP441
    # Raw/processed acoustic activity value.
    # This is NOT calibrated dB SPL yet.
    sound_level = Column(
        Float,
        nullable=True,
    )

    # GPS
    latitude = Column(
        Float,
        nullable=True,
    )

    longitude = Column(
        Float,
        nullable=True,
    )

    recorded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
    )

    hive = relationship(
        "Hive",
        back_populates="sensor_readings",
    )