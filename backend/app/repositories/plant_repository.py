"""Plant repository for data access."""

from datetime import date
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.plant import Plant
from app.schemas.plant import PlantCreate, PlantUpdate


class PlantRepository:
    """Repository for plant data access."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self,
        plant_type: str | None = None,
        category: str | None = None,
        location_id: UUID | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Plant]:
        """Get all plants with optional filters."""
        query = select(Plant).options(joinedload(Plant.location))

        if plant_type:
            query = query.filter(Plant.type == plant_type)
        if category:
            query = query.filter(Plant.category == category)
        if location_id:
            query = query.filter(Plant.location_id == location_id)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().unique().all())

    async def get_by_id(self, plant_id: UUID) -> Plant | None:
        """Get a plant by ID."""
        query = select(Plant).options(joinedload(Plant.location)).filter(Plant.id == plant_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_location(self, location_id: UUID) -> list[Plant]:
        """Get all plants in a specific location."""
        query = (
            select(Plant)
            .options(joinedload(Plant.location))
            .filter(Plant.location_id == location_id)
        )
        result = await self.db.execute(query)
        return list(result.scalars().unique().all())

    async def create(self, plant_data: PlantCreate) -> Plant:
        """Create a new plant."""
        plant = Plant(**plant_data.model_dump())
        self.db.add(plant)
        await self.db.flush()
        await self.db.refresh(plant, ["location"])
        return plant

    async def update(self, plant_id: UUID, plant_data: PlantUpdate) -> Plant | None:
        """Update a plant."""
        plant = await self.get_by_id(plant_id)
        if not plant:
            return None

        update_data = plant_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(plant, field, value)

        await self.db.flush()
        await self.db.refresh(plant, ["location"])
        return plant

    async def delete(self, plant_id: UUID) -> bool:
        """Delete a plant."""
        plant = await self.get_by_id(plant_id)
        if not plant:
            return False

        await self.db.delete(plant)
        await self.db.flush()
        return True

    async def search(self, query: str, limit: int = 50) -> list[Plant]:
        """Search plants by name or scientific name."""
        search_query = select(Plant).options(joinedload(Plant.location))
        search_query = search_query.filter(
            (Plant.name.ilike(f"%{query}%")) | (Plant.scientific_name.ilike(f"%{query}%"))
        )
        search_query = search_query.limit(limit)

        result = await self.db.execute(search_query)
        return list(result.scalars().unique().all())

    async def get_by_acquisition_date_range(
        self, start_date: date, end_date: date
    ) -> list[Plant]:
        """Get plants acquired within a date range."""
        query = (
            select(Plant)
            .options(joinedload(Plant.location))
            .filter(Plant.acquisition_date >= start_date, Plant.acquisition_date <= end_date)
        )
        result = await self.db.execute(query)
        return list(result.scalars().unique().all())
