from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import UserRole


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)

    email: EmailStr

    role: UserRole

    organization: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    phone: Optional[str] = Field(
        default=None,
        max_length=30,
    )


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    role: UserRole
    organization: Optional[str]
    phone: Optional[str]

    model_config = ConfigDict(
        from_attributes=True
    )