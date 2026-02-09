"""Pydantic schemas for growth log operations."""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator


class GrowthLogBase(BaseModel):
    """Base growth log schema."""

    measured_at: datetime
    height_cm: float | None = None
    width_cm: float | None = None
    health_status: str | None = None
    notes: str | None = None

    @field_validator("health_status")
    @classmethod
    def validate_health_status(cls, v: str | None) -> str | None:
        """Validate health status value."""
        if v is not None:
            allowed_values = ["excellent", "good", "fair", "poor"]
            if v not in allowed_values:
                raise ValueError(
                    f"health_status must be one of: {', '.join(allowed_values)}"
                )
        return v


class GrowthLogCreate(GrowthLogBase):
    """Schema for creating a growth log."""

    plant_id: UUID
    photo_id: UUID | None = None


class GrowthLogUpdate(BaseModel):
    """Schema for updating a growth log."""

    measured_at: datetime | None = None
    height_cm: float | None = None
    width_cm: float | None = None
    health_status: str | None = None
    notes: str | None = None
    photo_id: UUID | None = None

    @field_validator("health_status")
    @classmethod
    def validate_health_status(cls, v: str | None) -> str | None:
        """Validate health status value."""
        if v is not None:
            allowed_values = ["excellent", "good", "fair", "poor"]
            if v not in allowed_values:
                raise ValueError(
                    f"health_status must be one of: {', '.join(allowed_values)}"
                )
        return v


class GrowthLogResponse(GrowthLogBase):
    """Schema for growth log response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    plant_id: UUID
    photo_id: UUID | None
    created_at: datetime
