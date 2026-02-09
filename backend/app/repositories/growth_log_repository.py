"""Repository for growth log operations."""
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.growth_log import GrowthLog
from app.schemas.growth_log import GrowthLogCreate, GrowthLogUpdate


class GrowthLogRepository:
    """Repository for growth log operations."""

    def __init__(self, db: AsyncSession):
        """Initialize the repository."""
        self.db = db

    async def get_by_id(self, growth_log_id: UUID) -> GrowthLog | None:
        """Get a growth log by ID."""
        result = await self.db.execute(select(GrowthLog).where(GrowthLog.id == growth_log_id))
        return result.scalar_one_or_none()

    async def get_by_plant_id(self, plant_id: UUID) -> list[GrowthLog]:
        """Get all growth logs for a plant."""
        result = await self.db.execute(
            select(GrowthLog)
            .where(GrowthLog.plant_id == plant_id)
            .order_by(GrowthLog.measured_at.desc())
        )
        return list(result.scalars().all())

    async def create(self, growth_log_data: GrowthLogCreate) -> GrowthLog:
        """Create a new growth log."""
        growth_log = GrowthLog(**growth_log_data.model_dump())
        self.db.add(growth_log)
        await self.db.commit()
        await self.db.refresh(growth_log)
        return growth_log

    async def update(
        self, growth_log_id: UUID, growth_log_data: GrowthLogUpdate
    ) -> GrowthLog | None:
        """Update a growth log."""
        growth_log = await self.get_by_id(growth_log_id)
        if not growth_log:
            return None

        update_data = growth_log_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(growth_log, field, value)

        await self.db.commit()
        await self.db.refresh(growth_log)
        return growth_log

    async def delete(self, growth_log_id: UUID) -> bool:
        """Delete a growth log."""
        growth_log = await self.get_by_id(growth_log_id)
        if not growth_log:
            return False

        await self.db.delete(growth_log)
        await self.db.commit()
        return True
