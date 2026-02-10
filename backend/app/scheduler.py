"""Background job scheduler for notifications and maintenance tasks."""

import logging
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionLocal
from app.services.notification_service import NotificationService

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def check_due_tasks_job():
    """
    Background job to check for due tasks and create notifications.
    Runs daily at 8:00 AM.
    """
    logger.info("Running scheduled task: check_due_tasks")

    async with AsyncSessionLocal() as db:
        try:
            service = NotificationService(db)
            count = await service.check_due_tasks()
            logger.info(f"Created {count} notifications for due tasks")
        except Exception as e:
            logger.error(f"Error in check_due_tasks_job: {e}", exc_info=True)


async def cleanup_old_notifications_job():
    """
    Background job to clean up old read notifications.
    Runs weekly on Sunday at 2:00 AM.
    """
    logger.info("Running scheduled task: cleanup_old_notifications")

    async with AsyncSessionLocal() as db:
        try:
            service = NotificationService(db)
            count = await service.cleanup_old_notifications(days=30)
            logger.info(f"Cleaned up {count} old notifications")
        except Exception as e:
            logger.error(f"Error in cleanup_old_notifications_job: {e}", exc_info=True)


def start_scheduler():
    """Start the background job scheduler."""
    # Add job to check due tasks daily at 8:00 AM
    scheduler.add_job(
        check_due_tasks_job,
        trigger=CronTrigger(hour=8, minute=0),
        id="check_due_tasks",
        name="Check for due watering and fertilization tasks",
        replace_existing=True,
    )

    # Add job to cleanup old notifications weekly on Sunday at 2:00 AM
    scheduler.add_job(
        cleanup_old_notifications_job,
        trigger=CronTrigger(day_of_week="sun", hour=2, minute=0),
        id="cleanup_old_notifications",
        name="Clean up old read notifications",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("Scheduler started successfully")


def stop_scheduler():
    """Stop the background job scheduler."""
    scheduler.shutdown(wait=True)
    logger.info("Scheduler stopped")
