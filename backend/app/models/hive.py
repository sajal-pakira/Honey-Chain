import uuid

from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Float,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Apiary(Base):
    __tablename__ = "apiaries"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    beekeeper_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    name = Column(
        String(150),
        nullable=False,
    )

    latitude = Column(
        Float,
        nullable=True,
    )

    longitude = Column(
        Float,
        nullable=True,
    )

    location_name = Column(
        String(255),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    beekeeper = relationship(
        "User",
        backref="apiaries",
    )

    hives = relationship(
        "Hive",
        back_populates="apiary",
        cascade="all, delete-orphan",
    )


class Hive(Base):
    __tablename__ = "hives"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    apiary_id = Column(
        UUID(as_uuid=True),
        ForeignKey("apiaries.id", ondelete="CASCADE"),
        nullable=False,
    )

    hive_code = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    esp32_device_id = Column(
        String(150),
        unique=True,
        nullable=True,
        index=True,
    )

    status = Column(
        String(50),
        default="active",
        nullable=False,
    )

    installed_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    apiary = relationship(
        "Apiary",
        back_populates="hives",
    )

    sensor_readings = relationship(
        "SensorReading",
        back_populates="hive",
        cascade="all, delete-orphan",
    )