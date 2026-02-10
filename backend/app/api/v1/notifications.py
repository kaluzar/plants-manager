"""Notification API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.notification import (
    NotificationResponse,
    NotificationStats,
    NotificationMarkRead,
)
from app.services.notification_service import NotificationService

router = APIRouter()


def get_notification_service(db: AsyncSession = Depends(get_db)) -> NotificationService:
    """Dependency to get notification service."""
    return NotificationService(db)


@router.get("/", response_model=list[NotificationResponse])
async def get_notifications(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    unread_only: bool = Query(False, description="Return only unread notifications"),
    service: NotificationService = Depends(get_notification_service),
):
    """Get all notifications."""
    return await service.get_all_notifications(skip, limit, unread_only)


@router.get("/stats", response_model=NotificationStats)
async def get_notification_stats(
    service: NotificationService = Depends(get_notification_service),
):
    """Get notification statistics."""
    return await service.get_stats()


@router.post("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: UUID,
    service: NotificationService = Depends(get_notification_service),
):
    """Mark a notification as read."""
    return await service.mark_as_read(notification_id)


@router.post("/read-all", status_code=status.HTTP_200_OK)
async def mark_all_as_read(
    service: NotificationService = Depends(get_notification_service),
):
    """Mark all notifications as read."""
    count = await service.mark_all_as_read()
    return {"message": f"Marked {count} notifications as read"}


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: UUID,
    service: NotificationService = Depends(get_notification_service),
):
    """Delete a notification."""
    success = await service.delete_notification(notification_id)
    if not success:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Notification not found")
