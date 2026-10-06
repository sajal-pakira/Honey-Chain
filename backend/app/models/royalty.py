import uuid

from sqlalchemy import (
    Column,
    Numeric,
    DateTime,
    ForeignKey,
    String,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class RoyaltyRecord(Base):
    __tablename__ = "royalty_records"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    batch_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "honey_batches.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    beekeeper_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    # Value of the transaction that generated the royalty
    transaction_value = Column(
        Numeric(12, 2),
        nullable=True,
    )

    # Example: 5.00 = 5%
    royalty_percentage = Column(
        Numeric(5, 2),
        nullable=True,
    )

    royalty_amount = Column(
        Numeric(12, 2),
        nullable=True,
    )

    # Blockchain transaction proving the royalty record
    blockchain_tx_hash = Column(
        String(255),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    batch = relationship(
        "HoneyBatch",
        backref="royalty_records",
    )

    beekeeper = relationship(
        "User",
        backref="royalty_records",
    )