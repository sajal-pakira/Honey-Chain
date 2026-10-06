from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    BEEKEEPER = "beekeeper"
    PROCESSOR = "processor"
    DISTRIBUTOR = "distributor"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name = Column(
        String(150),
        nullable=False
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    role = Column(
    Enum(
        UserRole,
        name="user_role",
        values_callable=lambda enum_cls: [
            member.value for member in enum_cls
        ],
    ),
        nullable=False,
    )   

    organization = Column(
        String(255),
        nullable=True
    )

    phone = Column(
        String(30),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )