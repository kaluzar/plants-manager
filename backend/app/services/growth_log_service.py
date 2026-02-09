"""Service for growth log operations."""
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.growth_log_repository import GrowthLogRepository
from app.repositories.plant_repository import PlantRepository
from app.repositories.photo_repository import PhotoRepository
from app.schemas.growth_log import GrowthLogCreate, GrowthLogUpdate, GrowthLogResponse


class GrowthLogService:
    """Service for growth log business logic."""

    VALID_HEALTH_STATUSES = ["excellent", "good", "fair", "poor"]

    def __init__(self, db: AsyncSession):
        """Initialize the service."""
        self.db = db
        self.growth_log_repo = GrowthLogRepository(db)
        self.plant_repo = PlantRepository(db)
        self.photo_repo = PhotoRepository(db)

    async def get_growth_log_by_id(self, growth_log_id: UUID) -> GrowthLogResponse:
        """Get a growth log by ID."""
        growth_log = await self.growth_log_repo.get_by_id(growth_log_id)
        if not growth_log:
            raise HTTPException(status_code=404, detail="Growth log not found")
        return GrowthLogResponse.model_validate(growth_log)

    async def get_plant_growth_logs(self, plant_id: UUID) -> list[GrowthLogResponse]:
        """Get all growth logs for a plant."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        growth_logs = await self.growth_log_repo.get_by_plant_id(plant_id)
        return [GrowthLogResponse.model_validate(log) for log in growth_logs]

    async def create_growth_log(
        self, growth_log_data: GrowthLogCreate
    ) -> GrowthLogResponse:
        """Create a new growth log."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(growth_log_data.plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        # Verify photo exists if provided
        if growth_log_data.photo_id:
            photo = await self.photo_repo.get_by_id(growth_log_data.photo_id)
            if not photo:
                raise HTTPException(status_code=404, detail="Photo not found")
            # Verify photo belongs to the same plant
            if photo.plant_id != growth_log_data.plant_id:
                raise HTTPException(
                    status_code=400, detail="Photo must belong to the same plant"
                )

        # Validate health status
        if (
            growth_log_data.health_status
            and growth_log_data.health_status not in self.VALID_HEALTH_STATUSES
        ):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid health status. Must be one of: {', '.join(self.VALID_HEALTH_STATUSES)}",
            )

        growth_log = await self.growth_log_repo.create(growth_log_data)
        return GrowthLogResponse.model_validate(growth_log)

    async def update_growth_log(
        self, growth_log_id: UUID, growth_log_data: GrowthLogUpdate
    ) -> GrowthLogResponse:
        """Update a growth log."""
        # Get existing growth log
        existing = await self.growth_log_repo.get_by_id(growth_log_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Growth log not found")

        # Verify photo exists if provided
        if growth_log_data.photo_id:
            photo = await self.photo_repo.get_by_id(growth_log_data.photo_id)
            if not photo:
                raise HTTPException(status_code=404, detail="Photo not found")
            # Verify photo belongs to the same plant
            if photo.plant_id != existing.plant_id:
                raise HTTPException(
                    status_code=400, detail="Photo must belong to the same plant"
                )

        # Validate health status if provided
        if (
            growth_log_data.health_status
            and growth_log_data.health_status not in self.VALID_HEALTH_STATUSES
        ):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid health status. Must be one of: {', '.join(self.VALID_HEALTH_STATUSES)}",
            )

        growth_log = await self.growth_log_repo.update(growth_log_id, growth_log_data)
        if not growth_log:
            raise HTTPException(status_code=404, detail="Growth log not found")

        return GrowthLogResponse.model_validate(growth_log)

    async def delete_growth_log(self, growth_log_id: UUID) -> None:
        """Delete a growth log."""
        success = await self.growth_log_repo.delete(growth_log_id)
        if not success:
            raise HTTPException(status_code=404, detail="Growth log not found")
