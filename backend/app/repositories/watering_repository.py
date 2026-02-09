"""Repository for watering schedules and logs."""
from datetime import date, datetime, timedelta
from uuid import UUID

from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.watering import WateringSchedule, WateringLog
from app.schemas.watering import (
    WateringScheduleCreate,
    WateringScheduleUpdate,
    WateringLogCreate,
)


class WateringRepository:
    """Repository for watering operations."""

    def __init__(self, db: AsyncSession):
        """Initialize the repository."""
        self.db = db

    # Watering Schedule Methods
    async def get_schedule_by_id(self, schedule_id: UUID) -> WateringSchedule | None:
        """Get a watering schedule by ID."""
        result = await self.db.execute(
            select(WateringSchedule).where(WateringSchedule.id == schedule_id)
        )
        return result.scalar_one_or_none()

    async def get_schedules_by_plant_id(
        self, plant_id: UUID, active_only: bool = False
    ) -> list[WateringSchedule]:
        """Get all watering schedules for a plant."""
        query = select(WateringSchedule).where(WateringSchedule.plant_id == plant_id)

        if active_only:
            query = query.where(WateringSchedule.is_active == True)  # noqa: E712

        result = await self.db.execute(query.order_by(WateringSchedule.created_at.desc()))
        return list(result.scalars().all())

    async def create_schedule(
        self, schedule_data: WateringScheduleCreate
    ) -> WateringSchedule:
        """Create a new watering schedule."""
        schedule = WateringSchedule(**schedule_data.model_dump())
        self.db.add(schedule)
        await self.db.commit()
        await self.db.refresh(schedule)
        return schedule

    async def update_schedule(
        self, schedule_id: UUID, schedule_data: WateringScheduleUpdate
    ) -> WateringSchedule | None:
        """Update a watering schedule."""
        schedule = await self.get_schedule_by_id(schedule_id)
        if not schedule:
            return None

        update_data = schedule_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(schedule, field, value)

        await self.db.commit()
        await self.db.refresh(schedule)
        return schedule

    async def delete_schedule(self, schedule_id: UUID) -> bool:
        """Delete a watering schedule."""
        schedule = await self.get_schedule_by_id(schedule_id)
        if not schedule:
            return False

        await self.db.delete(schedule)
        await self.db.commit()
        return True

    # Watering Log Methods
    async def get_log_by_id(self, log_id: UUID) -> WateringLog | None:
        """Get a watering log by ID."""
        result = await self.db.execute(
            select(WateringLog).where(WateringLog.id == log_id)
        )
        return result.scalar_one_or_none()

    async def get_logs_by_plant_id(
        self, plant_id: UUID, limit: int = 50
    ) -> list[WateringLog]:
        """Get watering logs for a plant."""
        result = await self.db.execute(
            select(WateringLog)
            .where(WateringLog.plant_id == plant_id)
            .order_by(WateringLog.watered_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_latest_log_by_plant_id(self, plant_id: UUID) -> WateringLog | None:
        """Get the most recent watering log for a plant."""
        result = await self.db.execute(
            select(WateringLog)
            .where(WateringLog.plant_id == plant_id)
            .order_by(WateringLog.watered_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def create_log(self, log_data: WateringLogCreate) -> WateringLog:
        """Create a new watering log entry."""
        log = WateringLog(**log_data.model_dump())
        self.db.add(log)
        await self.db.commit()
        await self.db.refresh(log)
        return log

    async def delete_log(self, log_id: UUID) -> bool:
        """Delete a watering log."""
        log = await self.get_log_by_id(log_id)
        if not log:
            return False

        await self.db.delete(log)
        await self.db.commit()
        return True

    # Advanced Queries
    async def get_active_schedules(self) -> list[WateringSchedule]:
        """Get all active watering schedules."""
        today = date.today()

        result = await self.db.execute(
            select(WateringSchedule)
            .options(selectinload(WateringSchedule.plant))
            .where(
                and_(
                    WateringSchedule.is_active == True,  # noqa: E712
                    WateringSchedule.start_date <= today,
                    or_(
                        WateringSchedule.end_date.is_(None),
                        WateringSchedule.end_date >= today,
                    ),
                )
            )
        )
        return list(result.scalars().all())

    async def calculate_next_watering_date(
        self, schedule: WateringSchedule
    ) -> date | None:
        """Calculate the next watering date for a schedule."""
        if not schedule.is_active:
            return None

        # Get the latest watering log for this plant
        latest_log = await self.get_latest_log_by_plant_id(schedule.plant_id)

        if latest_log:
            # Calculate from last watering
            last_watered = latest_log.watered_at.date()
        else:
            # Calculate from schedule start date
            last_watered = schedule.start_date

        next_date = last_watered + timedelta(days=schedule.frequency_days)

        # Check if next date is within schedule bounds
        if schedule.end_date and next_date > schedule.end_date:
            return None

        return next_date

    async def get_plants_due_for_watering(
        self, days_ahead: int = 0
    ) -> list[tuple[WateringSchedule, date]]:
        """Get plants that are due for watering within the specified days ahead."""
        active_schedules = await self.get_active_schedules()
        due_plants = []

        target_date = date.today() + timedelta(days=days_ahead)

        for schedule in active_schedules:
            next_date = await self.calculate_next_watering_date(schedule)
            if next_date and next_date <= target_date:
                due_plants.append((schedule, next_date))

        # Sort by next watering date
        due_plants.sort(key=lambda x: x[1])
        return due_plants
