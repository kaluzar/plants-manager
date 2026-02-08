"""Location Pydantic schemas."""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class LocationBase(BaseModel):
    """Base location schema with common attributes."""

    name: str = Field(..., min_length=1, max_length=100, description="Location name")
    type: str = Field(..., description="Location type: indoor or outdoor")
    description: str | None = Field(None, description="Location description")
    zone: str | None = Field(None, max_length=100, description="Zone or area name")
    extra_data: dict[str, Any] | None = Field(
        None, description="Additional data (coordinates, layout info, etc.)"
    )


class LocationCreate(LocationBase):
    """Schema for creating a location."""

    pass


class LocationUpdate(BaseModel):
    """Schema for updating a location (all fields optional)."""

    name: str | None = Field(None, min_length=1, max_length=100)
    type: str | None = None
    description: str | None = None
    zone: str | None = Field(None, max_length=100)
    extra_data: dict[str, Any] | None = None


class LocationResponse(LocationBase):
    """Schema for location response."""

    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class LocationWithPlantsCount(LocationResponse):
    """Schema for location with plant count."""

    plants_count: int = 0
