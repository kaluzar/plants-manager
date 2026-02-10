"""Notification service for creating and managing notifications."""

from datetime import date, timedelta
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import NotificationType
from app.repositories.notification_repository import NotificationRepository
from app.repositories.watering_repository import WateringRepository
from app.repositories.fertilization_repository import FertilizationRepository
from app.schemas.notification import NotificationCreate, NotificationStats


class NotificationService:
    """Service for notification operations."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.notification_repo = NotificationRepository(db)
        self.watering_repo = WateringRepository(db)
        self.fertilization_repo = FertilizationRepository(db)

    async def get_all_notifications(
        self, skip: int = 0, limit: int = 100, unread_only: bool = False
    ):
        """Get all notifications."""
        return await self.notification_repo.get_all(skip, limit, unread_only)

    async def get_notification(self, notification_id: UUID):
        """Get a notification by ID."""
        notification = await self.notification_repo.get_by_id(notification_id)
        if not notification:
            raise ValueError("Notification not found")
        return notification

    async def mark_as_read(self, notification_id: UUID):
        """Mark a notification as read."""
        notification = await self.notification_repo.mark_as_read(notification_id)
        if not notification:
            raise ValueError("Notification not found")
        return notification

    async def mark_all_as_read(self) -> int:
        """Mark all notifications as read."""
        return await self.notification_repo.mark_all_as_read()

    async def get_stats(self) -> NotificationStats:
        """Get notification statistics."""
        all_notifications = await self.notification_repo.get_all(limit=1000)
        unread_count = await self.notification_repo.get_unread_count()

        return NotificationStats(total=len(all_notifications), unread=unread_count)

    async def delete_notification(self, notification_id: UUID) -> bool:
        """Delete a notification."""
        return await self.notification_repo.delete(notification_id)

    async def check_due_tasks(self) -> int:
        """
        Check for due tasks and create notifications.
        This method is called by the scheduler.
        Returns the number of notifications created.
        """
        notification_count = 0

        # Check for watering due today
        due_watering_list = await self.watering_repo.get_plants_due_for_watering(
            days_ahead=0
        )

        for schedule, next_date in due_watering_list:
            # Get plant details
            from app.repositories.plant_repository import PlantRepository

            plant_repo = PlantRepository(self.db)
            plant = await plant_repo.get_by_id(schedule.plant_id)

            if not plant:
                continue

            # Check if we already have a notification for this plant today
            existing_notifications = await self.notification_repo.get_all(limit=1000)
            today_notifications = [
                n
                for n in existing_notifications
                if n.plant_id == plant.id
                and n.type == NotificationType.WATERING_DUE
                and n.created_at.date() == date.today()
            ]

            if today_notifications:
                continue  # Already notified today

            # Create notification
            notification_data = NotificationCreate(
                type=NotificationType.WATERING_DUE,
                title=f"Watering Due: {plant.name}",
                message=f"{plant.name} needs watering today (every {schedule.frequency_days} days)",
                plant_id=plant.id,
                plant_name=plant.name,
            )

            await self.notification_repo.create(notification_data)
            notification_count += 1

        # Check for overdue watering (more than 1 day overdue)
        overdue_watering_list = await self.watering_repo.get_plants_due_for_watering(
            days_ahead=-1
        )

        for schedule, next_date in overdue_watering_list:
            # Get plant details
            from app.repositories.plant_repository import PlantRepository

            plant_repo = PlantRepository(self.db)
            plant = await plant_repo.get_by_id(schedule.plant_id)

            if not plant:
                continue

            days_overdue = (date.today() - next_date).days

            # Only create overdue notification if more than 1 day overdue
            if days_overdue <= 1:
                continue

            # Check if we already have an overdue notification for this plant today
            existing_notifications = await self.notification_repo.get_all(limit=1000)
            today_notifications = [
                n
                for n in existing_notifications
                if n.plant_id == plant.id
                and n.type == NotificationType.WATERING_OVERDUE
                and n.created_at.date() == date.today()
            ]

            if today_notifications:
                continue  # Already notified today

            # Create overdue notification
            notification_data = NotificationCreate(
                type=NotificationType.WATERING_OVERDUE,
                title=f"⚠️ Watering Overdue: {plant.name}",
                message=f"{plant.name} is {days_overdue} days overdue for watering!",
                plant_id=plant.id,
                plant_name=plant.name,
            )

            await self.notification_repo.create(notification_data)
            notification_count += 1

        # Check for fertilization due today
        due_fertilization_list = (
            await self.fertilization_repo.get_plants_due_for_fertilization(
                days_ahead=0
            )
        )

        for schedule, next_date in due_fertilization_list:
            # Get plant details
            from app.repositories.plant_repository import PlantRepository

            plant_repo = PlantRepository(self.db)
            plant = await plant_repo.get_by_id(schedule.plant_id)

            if not plant:
                continue

            # Check if we already have a notification for this plant today
            existing_notifications = await self.notification_repo.get_all(limit=1000)
            today_notifications = [
                n
                for n in existing_notifications
                if n.plant_id == plant.id
                and n.type == NotificationType.FERTILIZATION_DUE
                and n.created_at.date() == date.today()
            ]

            if today_notifications:
                continue  # Already notified today

            # Create notification
            notification_data = NotificationCreate(
                type=NotificationType.FERTILIZATION_DUE,
                title=f"Fertilization Due: {plant.name}",
                message=f"{plant.name} needs fertilization today (every {schedule.frequency_days} days)",
                plant_id=plant.id,
                plant_name=plant.name,
            )

            await self.notification_repo.create(notification_data)
            notification_count += 1

        # Check for overdue fertilization (more than 3 days overdue)
        overdue_fertilization_list = (
            await self.fertilization_repo.get_plants_due_for_fertilization(
                days_ahead=-3
            )
        )

        for schedule, next_date in overdue_fertilization_list:
            # Get plant details
            from app.repositories.plant_repository import PlantRepository

            plant_repo = PlantRepository(self.db)
            plant = await plant_repo.get_by_id(schedule.plant_id)

            if not plant:
                continue

            days_overdue = (date.today() - next_date).days

            # Only create overdue notification if more than 3 days overdue
            if days_overdue <= 3:
                continue

            # Check if we already have an overdue notification for this plant today
            existing_notifications = await self.notification_repo.get_all(limit=1000)
            today_notifications = [
                n
                for n in existing_notifications
                if n.plant_id == plant.id
                and n.type == NotificationType.FERTILIZATION_OVERDUE
                and n.created_at.date() == date.today()
            ]

            if today_notifications:
                continue  # Already notified today

            # Create overdue notification
            notification_data = NotificationCreate(
                type=NotificationType.FERTILIZATION_OVERDUE,
                title=f"⚠️ Fertilization Overdue: {plant.name}",
                message=f"{plant.name} is {days_overdue} days overdue for fertilization!",
                plant_id=plant.id,
                plant_name=plant.name,
            )

            await self.notification_repo.create(notification_data)
            notification_count += 1

        return notification_count

    async def cleanup_old_notifications(self, days: int = 30) -> int:
        """Clean up old read notifications."""
        return await self.notification_repo.delete_old_read_notifications(days)
