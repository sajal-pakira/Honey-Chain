import enum
import uuid

from sqlalchemy import (
    Column,
    String,
    Float,
    DateTime,
    ForeignKey,
    Enum,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class EventType(str, enum.Enum):
    HARVEST = "harvest"
    PROCESSING = "processing"
    PACKAGING = "packaging"
    SHIPMENT = "shipment"
    DELIVERY = "delivery"


class SupplyChainEvent(Base):
    __tablename__ = "supply_chain_events"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # Batch this event belongs to
    batch_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "honey_batches.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Type of supply-chain event
    event_type = Column(
        Enum(
    EventType,
    name="event_type",
    values_callable=lambda enum_cls: [
        member.value for member in enum_cls
    ],
),
        nullable=False,
    )

    # Person/company responsible for this event
    actor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )

    # Where the event happened
    location_name = Column(
        String(255),
        nullable=True,
    )

    latitude = Column(
        Float,
        nullable=True,
    )

    longitude = Column(
        Float,
        nullable=True,
    )

    # Quantity involved in this event
    quantity_kg = Column(
        Float,
        nullable=True,
    )

    notes = Column(
        Text,
        nullable=True,
    )

    # Optional blockchain proof for the event
    blockchain_tx_hash = Column(
        String(255),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
    )

    # Relationships
    batch = relationship(
        "HoneyBatch",
        backref="supply_chain_events",
    )

    actor = relationship(
        "User",
        backref="supply_chain_events",
    )