"""Pydantic schemas for watering."""
from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


# Watering Schedule Schemas
class WateringScheduleBase(BaseModel):
    """Base schema for watering schedule."""

    frequency_days: int = Field(..., gt=0, description="Frequency in days")
    amount: str | None = Field(None, max_length=100, description="Amount of water")
    time_of_day: str | None = Field(None, max_length=50, description="Time of day to water")
    start_date: date = Field(..., description="Start date of the schedule")
    end_date: date | None = Field(None, description="End date of the schedule")
    is_active: bool = Field(True, description="Whether the schedule is active")
    notes: str | None = Field(None, description="Additional notes")


class WateringScheduleCreate(WateringScheduleBase):
    """Schema for creating a watering schedule."""

    plant_id: UUID


class WateringScheduleUpdate(BaseModel):
    """Schema for updating a watering schedule."""

    frequency_days: int | None = Field(None, gt=0)
    amount: str | None = Field(None, max_length=100)
    time_of_day: str | None = Field(None, max_length=50)
    start_date: date | None = None
    end_date: date | None = None
    is_active: bool | None = None
    notes: str | None = None


class WateringScheduleResponse(WateringScheduleBase):
    """Schema for watering schedule response."""

    id: UUID
    plant_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Watering Log Schemas
class WateringLogBase(BaseModel):
    """Base schema for watering log."""

    watered_at: datetime = Field(..., description="When the plant was watered")
    amount: str | None = Field(None, max_length=100, description="Amount of water")
    notes: str | None = Field(None, description="Additional notes")


class WateringLogCreate(WateringLogBase):
    """Schema for creating a watering log."""

    plant_id: UUID
    watering_schedule_id: UUID | None = None


class WateringLogResponse(WateringLogBase):
    """Schema for watering log response."""

    id: UUID
    plant_id: UUID
    watering_schedule_id: UUID | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Extended Response with Next Watering Date
class WateringScheduleWithNextDate(WateringScheduleResponse):
    """Watering schedule with calculated next watering date."""

    next_watering_date: date | None = Field(None, description="Next scheduled watering date")
