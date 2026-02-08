"""Plant Pydantic schemas."""

from datetime import date, datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class PlantBase(BaseModel):
    """Base plant schema with common attributes."""

    name: str = Field(..., min_length=1, max_length=100, description="Plant name")
    scientific_name: str | None = Field(None, max_length=200, description="Scientific name")
    type: str = Field(..., description="Plant type: indoor or outdoor")
    category: str = Field(..., description="Category: flower, tree, grass, or other")
    species: str | None = Field(None, max_length=100, description="Species")
    location_id: UUID | None = Field(None, description="Location ID")
    acquisition_date: date | None = Field(None, description="Date acquired")
    notes: str | None = Field(None, description="Additional notes")
    extra_data: dict[str, Any] | None = Field(
        None, description="Additional data (growth metrics, health status, etc.)"
    )


class PlantCreate(PlantBase):
    """Schema for creating a plant."""

    pass


class PlantUpdate(BaseModel):
    """Schema for updating a plant (all fields optional)."""

    name: str | None = Field(None, min_length=1, max_length=100)
    scientific_name: str | None = Field(None, max_length=200)
    type: str | None = None
    category: str | None = None
    species: str | None = Field(None, max_length=100)
    location_id: UUID | None = None
    acquisition_date: date | None = None
    notes: str | None = None
    extra_data: dict[str, Any] | None = None


class PlantResponse(PlantBase):
    """Schema for plant response."""

    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PlantWithLocation(PlantResponse):
    """Schema for plant with location details."""

    location_name: str | None = None
    location_type: str | None = None
