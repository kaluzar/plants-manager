"""Pydantic schemas for treatments."""
from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


# Treatment Schemas
class TreatmentBase(BaseModel):
    """Base schema for treatment."""

    issue_type: str = Field(..., max_length=20, description="Type of issue (pest/disease)")
    issue_name: str = Field(..., max_length=100, description="Name of the issue")
    treatment_type: str = Field(
        ...,
        max_length=50,
        description="Type of treatment (chemical/organic/manual/biological)",
    )
    product_name: str | None = Field(None, max_length=200, description="Product name if applicable")
    start_date: date = Field(..., description="Start date of treatment")
    end_date: date | None = Field(None, description="End date of treatment")
    status: str = Field("active", max_length=20, description="Status (active/completed/cancelled)")
    notes: str | None = Field(None, description="Additional notes")


class TreatmentCreate(TreatmentBase):
    """Schema for creating a treatment."""

    plant_id: UUID


class TreatmentUpdate(BaseModel):
    """Schema for updating a treatment."""

    issue_type: str | None = Field(None, max_length=20)
    issue_name: str | None = Field(None, max_length=100)
    treatment_type: str | None = Field(None, max_length=50)
    product_name: str | None = Field(None, max_length=200)
    start_date: date | None = None
    end_date: date | None = None
    status: str | None = Field(None, max_length=20)
    notes: str | None = None


class TreatmentResponse(TreatmentBase):
    """Schema for treatment response."""

    id: UUID
    plant_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Treatment Application Schemas
class TreatmentApplicationBase(BaseModel):
    """Base schema for treatment application."""

    applied_at: datetime = Field(..., description="When the treatment was applied")
    amount: str | None = Field(None, max_length=100, description="Amount applied")
    notes: str | None = Field(None, description="Additional notes")


class TreatmentApplicationCreate(TreatmentApplicationBase):
    """Schema for creating a treatment application."""

    treatment_id: UUID


class TreatmentApplicationResponse(TreatmentApplicationBase):
    """Schema for treatment application response."""

    id: UUID
    treatment_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Extended Response with Applications
class TreatmentWithApplications(TreatmentResponse):
    """Treatment with its applications."""

    applications: list[TreatmentApplicationResponse] = []
