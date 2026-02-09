"""Pydantic schemas for photo operations."""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PhotoBase(BaseModel):
    """Base photo schema."""

    caption: str | None = None
    taken_at: datetime | None = None


class PhotoCreate(PhotoBase):
    """Schema for creating a photo."""

    plant_id: UUID


class PhotoUpdate(BaseModel):
    """Schema for updating a photo."""

    caption: str | None = None
    taken_at: datetime | None = None


class PhotoResponse(PhotoBase):
    """Schema for photo response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    plant_id: UUID
    file_path: str
    thumbnail_path: str | None
    original_filename: str
    file_size: int
    mime_type: str
    width: int | None
    height: int | None
    created_at: datetime
