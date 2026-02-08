"""Location repository for database operations."""

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.location import Location
from app.schemas.location import LocationCreate, LocationUpdate


class LocationRepository:
    """Repository for location CRUD operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Location]:
        """Get all locations."""
        result = await self.db.execute(select(Location).order_by(Location.name))
        return list(result.scalars().all())

    async def get_by_id(self, location_id: UUID) -> Location | None:
        """Get location by ID."""
        result = await self.db.execute(select(Location).where(Location.id == location_id))
        return result.scalar_one_or_none()

    async def get_by_type(self, location_type: str) -> list[Location]:
        """Get locations by type (indoor/outdoor)."""
        result = await self.db.execute(
            select(Location).where(Location.type == location_type).order_by(Location.name)
        )
        return list(result.scalars().all())

    async def create(self, location_data: LocationCreate) -> Location:
        """Create a new location."""
        location = Location(**location_data.model_dump())
        self.db.add(location)
        await self.db.flush()
        await self.db.refresh(location)
        return location

    async def update(self, location_id: UUID, location_data: LocationUpdate) -> Location | None:
        """Update an existing location."""
        location = await self.get_by_id(location_id)
        if not location:
            return None

        update_data = location_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(location, field, value)

        await self.db.flush()
        await self.db.refresh(location)
        return location

    async def delete(self, location_id: UUID) -> bool:
        """Delete a location."""
        location = await self.get_by_id(location_id)
        if not location:
            return False

        await self.db.delete(location)
        await self.db.flush()
        return True

    async def count_plants(self, location_id: UUID) -> int:
        """Count plants in a location."""
        from app.models.plant import Plant

        result = await self.db.execute(
            select(func.count()).select_from(Plant).where(Plant.location_id == location_id)
        )
        return result.scalar_one()
