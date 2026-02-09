"""Repository for fertilization schedules and logs."""
from datetime import date, datetime, timedelta
from uuid import UUID

from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.fertilization import FertilizationSchedule, FertilizationLog
from app.schemas.fertilization import (
    FertilizationScheduleCreate,
    FertilizationScheduleUpdate,
    FertilizationLogCreate,
)


class FertilizationRepository:
    """Repository for fertilization operations."""

    def __init__(self, db: AsyncSession):
        """Initialize the repository."""
        self.db = db

    # Fertilization Schedule Methods
    async def get_schedule_by_id(
        self, schedule_id: UUID
    ) -> FertilizationSchedule | None:
        """Get a fertilization schedule by ID."""
        result = await self.db.execute(
            select(FertilizationSchedule).where(FertilizationSchedule.id == schedule_id)
        )
        return result.scalar_one_or_none()

    async def get_schedules_by_plant_id(
        self, plant_id: UUID, active_only: bool = False
    ) -> list[FertilizationSchedule]:
        """Get all fertilization schedules for a plant."""
        query = select(FertilizationSchedule).where(
            FertilizationSchedule.plant_id == plant_id
        )

        if active_only:
            query = query.where(FertilizationSchedule.is_active == True)  # noqa: E712

        result = await self.db.execute(
            query.order_by(FertilizationSchedule.created_at.desc())
        )
        return list(result.scalars().all())

    async def create_schedule(
        self, schedule_data: FertilizationScheduleCreate
    ) -> FertilizationSchedule:
        """Create a new fertilization schedule."""
        schedule = FertilizationSchedule(**schedule_data.model_dump())
        self.db.add(schedule)
        await self.db.commit()
        await self.db.refresh(schedule)
        return schedule

    async def update_schedule(
        self, schedule_id: UUID, schedule_data: FertilizationScheduleUpdate
    ) -> FertilizationSchedule | None:
        """Update a fertilization schedule."""
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
        """Delete a fertilization schedule."""
        schedule = await self.get_schedule_by_id(schedule_id)
        if not schedule:
            return False

        await self.db.delete(schedule)
        await self.db.commit()
        return True

    # Fertilization Log Methods
    async def get_log_by_id(self, log_id: UUID) -> FertilizationLog | None:
        """Get a fertilization log by ID."""
        result = await self.db.execute(
            select(FertilizationLog).where(FertilizationLog.id == log_id)
        )
        return result.scalar_one_or_none()

    async def get_logs_by_plant_id(
        self, plant_id: UUID, limit: int = 50
    ) -> list[FertilizationLog]:
        """Get fertilization logs for a plant."""
        result = await self.db.execute(
            select(FertilizationLog)
            .where(FertilizationLog.plant_id == plant_id)
            .order_by(FertilizationLog.fertilized_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_latest_log_by_plant_id(
        self, plant_id: UUID
    ) -> FertilizationLog | None:
        """Get the most recent fertilization log for a plant."""
        result = await self.db.execute(
            select(FertilizationLog)
            .where(FertilizationLog.plant_id == plant_id)
            .order_by(FertilizationLog.fertilized_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def create_log(self, log_data: FertilizationLogCreate) -> FertilizationLog:
        """Create a new fertilization log entry."""
        log = FertilizationLog(**log_data.model_dump())
        self.db.add(log)
        await self.db.commit()
        await self.db.refresh(log)
        return log

    async def delete_log(self, log_id: UUID) -> bool:
        """Delete a fertilization log."""
        log = await self.get_log_by_id(log_id)
        if not log:
            return False

        await self.db.delete(log)
        await self.db.commit()
        return True

    # Advanced Queries
    async def get_active_schedules(self) -> list[FertilizationSchedule]:
        """Get all active fertilization schedules."""
        today = date.today()

        result = await self.db.execute(
            select(FertilizationSchedule)
            .options(selectinload(FertilizationSchedule.plant))
            .where(
                and_(
                    FertilizationSchedule.is_active == True,  # noqa: E712
                    FertilizationSchedule.start_date <= today,
                    or_(
                        FertilizationSchedule.end_date.is_(None),
                        FertilizationSchedule.end_date >= today,
                    ),
                )
            )
        )
        return list(result.scalars().all())

    async def calculate_next_fertilization_date(
        self, schedule: FertilizationSchedule
    ) -> date | None:
        """Calculate the next fertilization date for a schedule."""
        if not schedule.is_active:
            return None

        # Get the latest fertilization log for this plant
        latest_log = await self.get_latest_log_by_plant_id(schedule.plant_id)

        if latest_log:
            # Calculate from last fertilization
            last_fertilized = latest_log.fertilized_at.date()
        else:
            # Calculate from schedule start date
            last_fertilized = schedule.start_date

        next_date = last_fertilized + timedelta(days=schedule.frequency_days)

        # Check if next date is within schedule bounds
        if schedule.end_date and next_date > schedule.end_date:
            return None

        return next_date

    async def get_plants_due_for_fertilization(
        self, days_ahead: int = 0
    ) -> list[tuple[FertilizationSchedule, date]]:
        """Get plants that are due for fertilization within the specified days ahead."""
        active_schedules = await self.get_active_schedules()
        due_plants = []

        target_date = date.today() + timedelta(days=days_ahead)

        for schedule in active_schedules:
            next_date = await self.calculate_next_fertilization_date(schedule)
            if next_date and next_date <= target_date:
                due_plants.append((schedule, next_date))

        # Sort by next fertilization date
        due_plants.sort(key=lambda x: x[1])
        return due_plants
