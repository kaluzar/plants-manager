"""Plant service for business logic."""

from datetime import date
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.plant_repository import PlantRepository
from app.schemas.plant import PlantCreate, PlantResponse, PlantUpdate, PlantWithLocation


class PlantService:
    """Service for plant business logic."""

    def __init__(self, db: AsyncSession):
        self.repository = PlantRepository(db)

    async def get_all_plants(
        self,
        plant_type: str | None = None,
        category: str | None = None,
        location_id: UUID | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[PlantWithLocation]:
        """Get all plants with optional filters."""
        # Validate plant_type if provided
        if plant_type and plant_type not in ["indoor", "outdoor"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid plant type. Must be 'indoor' or 'outdoor'.",
            )

        # Validate category if provided
        if category and category not in ["flower", "tree", "grass", "other"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid category. Must be 'flower', 'tree', 'grass', or 'other'.",
            )

        plants = await self.repository.get_all(
            plant_type=plant_type,
            category=category,
            location_id=location_id,
            skip=skip,
            limit=limit,
        )

        # Convert to response schema with location details
        return [self._to_plant_with_location(plant) for plant in plants]

    async def get_plant(self, plant_id: UUID) -> PlantWithLocation:
        """Get a plant by ID."""
        plant = await self.repository.get_by_id(plant_id)
        if not plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Plant not found"
            )
        return self._to_plant_with_location(plant)

    async def get_plants_by_location(self, location_id: UUID) -> list[PlantWithLocation]:
        """Get all plants in a specific location."""
        plants = await self.repository.get_by_location(location_id)
        return [self._to_plant_with_location(plant) for plant in plants]

    async def create_plant(self, plant_data: PlantCreate) -> PlantResponse:
        """Create a new plant."""
        # Validate plant type
        if plant_data.type not in ["indoor", "outdoor"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid plant type. Must be 'indoor' or 'outdoor'.",
            )

        # Validate category
        if plant_data.category not in ["flower", "tree", "grass", "other"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid category. Must be 'flower', 'tree', 'grass', or 'other'.",
            )

        plant = await self.repository.create(plant_data)
        return PlantResponse.model_validate(plant)

    async def update_plant(self, plant_id: UUID, plant_data: PlantUpdate) -> PlantResponse:
        """Update a plant."""
        # Validate plant type if provided
        if plant_data.type and plant_data.type not in ["indoor", "outdoor"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid plant type. Must be 'indoor' or 'outdoor'.",
            )

        # Validate category if provided
        if plant_data.category and plant_data.category not in ["flower", "tree", "grass", "other"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid category. Must be 'flower', 'tree', 'grass', or 'other'.",
            )

        plant = await self.repository.update(plant_id, plant_data)
        if not plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Plant not found"
            )
        return PlantResponse.model_validate(plant)

    async def delete_plant(self, plant_id: UUID) -> None:
        """Delete a plant."""
        success = await self.repository.delete(plant_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Plant not found"
            )

    async def search_plants(self, query: str, limit: int = 50) -> list[PlantWithLocation]:
        """Search plants by name or scientific name."""
        if not query or len(query) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Search query must be at least 2 characters.",
            )

        plants = await self.repository.search(query, limit)
        return [self._to_plant_with_location(plant) for plant in plants]

    async def get_plants_by_acquisition_date_range(
        self, start_date: date, end_date: date
    ) -> list[PlantWithLocation]:
        """Get plants acquired within a date range."""
        if start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Start date must be before end date.",
            )

        plants = await self.repository.get_by_acquisition_date_range(start_date, end_date)
        return [self._to_plant_with_location(plant) for plant in plants]

    def _to_plant_with_location(self, plant) -> PlantWithLocation:
        """Convert plant model to PlantWithLocation schema."""
        plant_dict = {
            "id": plant.id,
            "name": plant.name,
            "scientific_name": plant.scientific_name,
            "type": plant.type,
            "category": plant.category,
            "species": plant.species,
            "location_id": plant.location_id,
            "acquisition_date": plant.acquisition_date,
            "notes": plant.notes,
            "extra_data": plant.extra_data,
            "created_at": plant.created_at,
            "updated_at": plant.updated_at,
            "location_name": plant.location.name if plant.location else None,
            "location_type": plant.location.type if plant.location else None,
        }
        return PlantWithLocation(**plant_dict)
