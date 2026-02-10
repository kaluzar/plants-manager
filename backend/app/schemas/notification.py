"""Notification schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class NotificationBase(BaseModel):
    """Base notification schema."""

    type: str
    title: str
    message: str
    plant_id: UUID | None = None
    plant_name: str | None = None


class NotificationCreate(NotificationBase):
    """Schema for creating a notification."""

    pass


class NotificationResponse(NotificationBase):
    """Schema for notification response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    is_read: bool
    created_at: datetime
    read_at: datetime | None = None


class NotificationMarkRead(BaseModel):
    """Schema for marking notification as read."""

    is_read: bool = True


class NotificationStats(BaseModel):
    """Schema for notification statistics."""

    total: int
    unread: int
