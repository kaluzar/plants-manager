"""Pydantic schemas for fertilization."""
from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


# Fertilization Schedule Schemas
class FertilizationScheduleBase(BaseModel):
    """Base schema for fertilization schedule."""

    frequency_days: int = Field(..., gt=0, description="Frequency in days")
    fertilizer_type: str | None = Field(None, max_length=100, description="Type of fertilizer")
    amount: str | None = Field(None, max_length=100, description="Amount of fertilizer")
    start_date: date = Field(..., description="Start date of the schedule")
    end_date: date | None = Field(None, description="End date of the schedule")
    is_active: bool = Field(True, description="Whether the schedule is active")
    notes: str | None = Field(None, description="Additional notes")


class FertilizationScheduleCreate(FertilizationScheduleBase):
    """Schema for creating a fertilization schedule."""

    plant_id: UUID


class FertilizationScheduleUpdate(BaseModel):
    """Schema for updating a fertilization schedule."""

    frequency_days: int | None = Field(None, gt=0)
    fertilizer_type: str | None = Field(None, max_length=100)
    amount: str | None = Field(None, max_length=100)
    start_date: date | None = None
    end_date: date | None = None
    is_active: bool | None = None
    notes: str | None = None


class FertilizationScheduleResponse(FertilizationScheduleBase):
    """Schema for fertilization schedule response."""

    id: UUID
    plant_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Fertilization Log Schemas
class FertilizationLogBase(BaseModel):
    """Base schema for fertilization log."""

    fertilized_at: datetime = Field(..., description="When the plant was fertilized")
    fertilizer_type: str | None = Field(None, max_length=100, description="Type of fertilizer")
    amount: str | None = Field(None, max_length=100, description="Amount of fertilizer")
    notes: str | None = Field(None, description="Additional notes")


class FertilizationLogCreate(FertilizationLogBase):
    """Schema for creating a fertilization log."""

    plant_id: UUID
    fertilization_schedule_id: UUID | None = None


class FertilizationLogResponse(FertilizationLogBase):
    """Schema for fertilization log response."""

    id: UUID
    plant_id: UUID
    fertilization_schedule_id: UUID | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Extended Response with Next Fertilization Date
class FertilizationScheduleWithNextDate(FertilizationScheduleResponse):
    """Fertilization schedule with calculated next fertilization date."""

    next_fertilization_date: date | None = Field(None, description="Next scheduled fertilization date")
