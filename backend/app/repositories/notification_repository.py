"""Notification repository for database operations."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification
from app.schemas.notification import NotificationCreate


class NotificationRepository:
    """Repository for notification database operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, notification_data: NotificationCreate) -> Notification:
        """Create a new notification."""
        notification = Notification(**notification_data.model_dump())
        self.db.add(notification)
        await self.db.commit()
        await self.db.refresh(notification)
        return notification

    async def get_by_id(self, notification_id: UUID) -> Notification | None:
        """Get a notification by ID."""
        query = select(Notification).where(Notification.id == notification_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_all(
        self, skip: int = 0, limit: int = 100, unread_only: bool = False
    ) -> list[Notification]:
        """Get all notifications with optional filters."""
        query = select(Notification)

        if unread_only:
            query = query.where(Notification.is_read == False)

        query = query.order_by(Notification.created_at.desc()).offset(skip).limit(limit)

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def mark_as_read(self, notification_id: UUID) -> Notification | None:
        """Mark a notification as read."""
        notification = await self.get_by_id(notification_id)
        if notification:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(notification)
        return notification

    async def mark_all_as_read(self) -> int:
        """Mark all notifications as read."""
        query = select(Notification).where(Notification.is_read == False)
        result = await self.db.execute(query)
        notifications = result.scalars().all()

        count = 0
        for notification in notifications:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            count += 1

        if count > 0:
            await self.db.commit()

        return count

    async def get_unread_count(self) -> int:
        """Get count of unread notifications."""
        query = select(func.count(Notification.id)).where(Notification.is_read == False)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def delete(self, notification_id: UUID) -> bool:
        """Delete a notification."""
        notification = await self.get_by_id(notification_id)
        if notification:
            await self.db.delete(notification)
            await self.db.commit()
            return True
        return False

    async def delete_old_read_notifications(self, days: int = 30) -> int:
        """Delete read notifications older than specified days."""
        from datetime import timedelta

        cutoff_date = datetime.utcnow() - timedelta(days=days)

        query = select(Notification).where(
            and_(Notification.is_read == True, Notification.read_at < cutoff_date)
        )

        result = await self.db.execute(query)
        notifications = result.scalars().all()

        count = len(notifications)
        for notification in notifications:
            await self.db.delete(notification)

        if count > 0:
            await self.db.commit()

        return count
