from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

from app.core.database import Base


class BatchStatus(str, enum.Enum):
    harvested = "harvested"
    processing = "processing"
    packaged = "packaged"
    shipped = "shipped"
    delivered = "delivered"
    verified = "verified"


class SupplyChainEventType(str, enum.Enum):
    harvest = "harvest"
    processing = "processing"
    packaging = "packaging"
    shipment = "shipment"
    delivery = "delivery"


class HoneyBatch(Base):
    __tablename__ = "honey_batches"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    batch_code = Column(
        String(64),
        unique=True,
        nullable=False,
        index=True
    )

    hive_id = Column(
        UUID(as_uuid=True),
        ForeignKey("hives.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    beekeeper_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    harvest_date = Column(
        DateTime(timezone=True),
        nullable=False
    )

    harvested_weight_kg = Column(
        Float,
        nullable=False
    )

    honey_type = Column(
        String(100),
        nullable=True
    )

    floral_source = Column(
        String(150),
        nullable=True
    )

    status = Column(
        Enum(
            BatchStatus,
            name="batch_status",
            values_callable=lambda e: [m.value for m in e]
        ),
        nullable=False,
        default=BatchStatus.harvested,
    )

    blockchain_hash = Column(
        String(128),
        nullable=True
    )

    blockchain_tx_hash = Column(
        String(128),
        nullable=True
    )

    qr_token = Column(
        String(128),
        unique=True,
        nullable=False,
        index=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    hive = relationship("Hive")
    beekeeper = relationship("User")

    events = relationship(
        "SupplyChainEvent",
        back_populates="batch",
        cascade="all, delete-orphan"
    )


class SupplyChainEvent(Base):
    __tablename__ = "supply_chain_events"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    batch_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "honey_batches.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    event_type = Column(
        Enum(
            SupplyChainEventType,
            name="supply_chain_event_type",
            values_callable=lambda e: [m.value for m in e]
        ),
        nullable=False,
    )

    actor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    location_name = Column(
        String(255),
        nullable=True
    )

    latitude = Column(
        Float,
        nullable=True
    )

    longitude = Column(
        Float,
        nullable=True
    )

    quantity_kg = Column(
        Float,
        nullable=True
    )

    notes = Column(
        Text,
        nullable=True
    )

    blockchain_tx_hash = Column(
        String(128),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    batch = relationship(
        "HoneyBatch",
        back_populates="events"
    )