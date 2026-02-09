"""Service for watering operations."""
from uuid import UUID
from datetime import date

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.watering_repository import WateringRepository
from app.repositories.plant_repository import PlantRepository
from app.schemas.watering import (
    WateringScheduleCreate,
    WateringScheduleUpdate,
    WateringScheduleResponse,
    WateringScheduleWithNextDate,
    WateringLogCreate,
    WateringLogResponse,
)


class WateringService:
    """Service for watering business logic."""

    def __init__(self, db: AsyncSession):
        """Initialize the service."""
        self.db = db
        self.watering_repo = WateringRepository(db)
        self.plant_repo = PlantRepository(db)

    # Watering Schedule Methods
    async def get_schedule_by_id(
        self, schedule_id: UUID
    ) -> WateringScheduleResponse:
        """Get a watering schedule by ID."""
        schedule = await self.watering_repo.get_schedule_by_id(schedule_id)
        if not schedule:
            raise HTTPException(status_code=404, detail="Watering schedule not found")
        return WateringScheduleResponse.model_validate(schedule)

    async def get_schedules_by_plant_id(
        self, plant_id: UUID, active_only: bool = False
    ) -> list[WateringScheduleResponse]:
        """Get all watering schedules for a plant."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        schedules = await self.watering_repo.get_schedules_by_plant_id(
            plant_id, active_only
        )
        return [WateringScheduleResponse.model_validate(s) for s in schedules]

    async def create_schedule(
        self, schedule_data: WateringScheduleCreate
    ) -> WateringScheduleResponse:
        """Create a new watering schedule."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(schedule_data.plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        # Validate date range
        if schedule_data.end_date and schedule_data.end_date < schedule_data.start_date:
            raise HTTPException(
                status_code=400, detail="End date must be after start date"
            )

        schedule = await self.watering_repo.create_schedule(schedule_data)
        return WateringScheduleResponse.model_validate(schedule)

    async def update_schedule(
        self, schedule_id: UUID, schedule_data: WateringScheduleUpdate
    ) -> WateringScheduleResponse:
        """Update a watering schedule."""
        # Get existing schedule to validate
        existing = await self.watering_repo.get_schedule_by_id(schedule_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Watering schedule not found")

        # Validate date range if both dates are provided
        start_date = schedule_data.start_date or existing.start_date
        end_date = schedule_data.end_date if schedule_data.end_date is not None else existing.end_date

        if end_date and end_date < start_date:
            raise HTTPException(
                status_code=400, detail="End date must be after start date"
            )

        schedule = await self.watering_repo.update_schedule(schedule_id, schedule_data)
        if not schedule:
            raise HTTPException(status_code=404, detail="Watering schedule not found")

        return WateringScheduleResponse.model_validate(schedule)

    async def delete_schedule(self, schedule_id: UUID) -> None:
        """Delete a watering schedule."""
        success = await self.watering_repo.delete_schedule(schedule_id)
        if not success:
            raise HTTPException(status_code=404, detail="Watering schedule not found")

    # Watering Log Methods
    async def get_logs_by_plant_id(
        self, plant_id: UUID, limit: int = 50
    ) -> list[WateringLogResponse]:
        """Get watering logs for a plant."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        logs = await self.watering_repo.get_logs_by_plant_id(plant_id, limit)
        return [WateringLogResponse.model_validate(log) for log in logs]

    async def create_log(self, log_data: WateringLogCreate) -> WateringLogResponse:
        """Create a new watering log entry."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(log_data.plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        # Verify schedule exists if provided
        if log_data.watering_schedule_id:
            schedule = await self.watering_repo.get_schedule_by_id(
                log_data.watering_schedule_id
            )
            if not schedule:
                raise HTTPException(
                    status_code=404, detail="Watering schedule not found"
                )

        log = await self.watering_repo.create_log(log_data)
        return WateringLogResponse.model_validate(log)

    async def delete_log(self, log_id: UUID) -> None:
        """Delete a watering log."""
        success = await self.watering_repo.delete_log(log_id)
        if not success:
            raise HTTPException(status_code=404, detail="Watering log not found")

    # Advanced Methods
    async def get_schedule_with_next_date(
        self, schedule_id: UUID
    ) -> WateringScheduleWithNextDate:
        """Get a watering schedule with calculated next watering date."""
        schedule = await self.watering_repo.get_schedule_by_id(schedule_id)
        if not schedule:
            raise HTTPException(status_code=404, detail="Watering schedule not found")

        next_date = await self.watering_repo.calculate_next_watering_date(schedule)

        response = WateringScheduleWithNextDate.model_validate(schedule)
        response.next_watering_date = next_date
        return response

    async def get_plants_due_for_watering(
        self, days_ahead: int = 0
    ) -> list[WateringScheduleWithNextDate]:
        """Get plants that are due for watering."""
        due_plants = await self.watering_repo.get_plants_due_for_watering(days_ahead)

        results = []
        for schedule, next_date in due_plants:
            response = WateringScheduleWithNextDate.model_validate(schedule)
            response.next_watering_date = next_date
            results.append(response)

        return results
