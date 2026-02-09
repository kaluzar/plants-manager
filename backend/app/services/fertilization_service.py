"""Service for fertilization operations."""
from uuid import UUID
from datetime import date

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.fertilization_repository import FertilizationRepository
from app.repositories.plant_repository import PlantRepository
from app.schemas.fertilization import (
    FertilizationScheduleCreate,
    FertilizationScheduleUpdate,
    FertilizationScheduleResponse,
    FertilizationScheduleWithNextDate,
    FertilizationLogCreate,
    FertilizationLogResponse,
)


class FertilizationService:
    """Service for fertilization business logic."""

    def __init__(self, db: AsyncSession):
        """Initialize the service."""
        self.db = db
        self.fertilization_repo = FertilizationRepository(db)
        self.plant_repo = PlantRepository(db)

    # Fertilization Schedule Methods
    async def get_schedule_by_id(
        self, schedule_id: UUID
    ) -> FertilizationScheduleResponse:
        """Get a fertilization schedule by ID."""
        schedule = await self.fertilization_repo.get_schedule_by_id(schedule_id)
        if not schedule:
            raise HTTPException(
                status_code=404, detail="Fertilization schedule not found"
            )
        return FertilizationScheduleResponse.model_validate(schedule)

    async def get_schedules_by_plant_id(
        self, plant_id: UUID, active_only: bool = False
    ) -> list[FertilizationScheduleResponse]:
        """Get all fertilization schedules for a plant."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        schedules = await self.fertilization_repo.get_schedules_by_plant_id(
            plant_id, active_only
        )
        return [FertilizationScheduleResponse.model_validate(s) for s in schedules]

    async def create_schedule(
        self, schedule_data: FertilizationScheduleCreate
    ) -> FertilizationScheduleResponse:
        """Create a new fertilization schedule."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(schedule_data.plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        # Validate date range
        if schedule_data.end_date and schedule_data.end_date < schedule_data.start_date:
            raise HTTPException(
                status_code=400, detail="End date must be after start date"
            )

        schedule = await self.fertilization_repo.create_schedule(schedule_data)
        return FertilizationScheduleResponse.model_validate(schedule)

    async def update_schedule(
        self, schedule_id: UUID, schedule_data: FertilizationScheduleUpdate
    ) -> FertilizationScheduleResponse:
        """Update a fertilization schedule."""
        # Get existing schedule to validate
        existing = await self.fertilization_repo.get_schedule_by_id(schedule_id)
        if not existing:
            raise HTTPException(
                status_code=404, detail="Fertilization schedule not found"
            )

        # Validate date range if both dates are provided
        start_date = schedule_data.start_date or existing.start_date
        end_date = (
            schedule_data.end_date
            if schedule_data.end_date is not None
            else existing.end_date
        )

        if end_date and end_date < start_date:
            raise HTTPException(
                status_code=400, detail="End date must be after start date"
            )

        schedule = await self.fertilization_repo.update_schedule(
            schedule_id, schedule_data
        )
        if not schedule:
            raise HTTPException(
                status_code=404, detail="Fertilization schedule not found"
            )

        return FertilizationScheduleResponse.model_validate(schedule)

    async def delete_schedule(self, schedule_id: UUID) -> None:
        """Delete a fertilization schedule."""
        success = await self.fertilization_repo.delete_schedule(schedule_id)
        if not success:
            raise HTTPException(
                status_code=404, detail="Fertilization schedule not found"
            )

    # Fertilization Log Methods
    async def get_logs_by_plant_id(
        self, plant_id: UUID, limit: int = 50
    ) -> list[FertilizationLogResponse]:
        """Get fertilization logs for a plant."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        logs = await self.fertilization_repo.get_logs_by_plant_id(plant_id, limit)
        return [FertilizationLogResponse.model_validate(log) for log in logs]

    async def create_log(
        self, log_data: FertilizationLogCreate
    ) -> FertilizationLogResponse:
        """Create a new fertilization log entry."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(log_data.plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        # Verify schedule exists if provided
        if log_data.fertilization_schedule_id:
            schedule = await self.fertilization_repo.get_schedule_by_id(
                log_data.fertilization_schedule_id
            )
            if not schedule:
                raise HTTPException(
                    status_code=404, detail="Fertilization schedule not found"
                )

        log = await self.fertilization_repo.create_log(log_data)
        return FertilizationLogResponse.model_validate(log)

    async def delete_log(self, log_id: UUID) -> None:
        """Delete a fertilization log."""
        success = await self.fertilization_repo.delete_log(log_id)
        if not success:
            raise HTTPException(status_code=404, detail="Fertilization log not found")

    # Advanced Methods
    async def get_schedule_with_next_date(
        self, schedule_id: UUID
    ) -> FertilizationScheduleWithNextDate:
        """Get a fertilization schedule with calculated next fertilization date."""
        schedule = await self.fertilization_repo.get_schedule_by_id(schedule_id)
        if not schedule:
            raise HTTPException(
                status_code=404, detail="Fertilization schedule not found"
            )

        next_date = await self.fertilization_repo.calculate_next_fertilization_date(
            schedule
        )

        response = FertilizationScheduleWithNextDate.model_validate(schedule)
        response.next_fertilization_date = next_date
        return response

    async def get_plants_due_for_fertilization(
        self, days_ahead: int = 0
    ) -> list[FertilizationScheduleWithNextDate]:
        """Get plants that are due for fertilization."""
        due_plants = await self.fertilization_repo.get_plants_due_for_fertilization(
            days_ahead
        )

        results = []
        for schedule, next_date in due_plants:
            response = FertilizationScheduleWithNextDate.model_validate(schedule)
            response.next_fertilization_date = next_date
            results.append(response)

        return results
