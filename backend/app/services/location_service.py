"""Location service for business logic."""

from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.location_repository import LocationRepository
from app.schemas.location import LocationCreate, LocationResponse, LocationUpdate, LocationWithPlantsCount


class LocationService:
    """Service for location business logic."""

    def __init__(self, db: AsyncSession):
        self.repository = LocationRepository(db)

    async def get_all_locations(self) -> list[LocationWithPlantsCount]:
        """Get all locations with plant counts."""
        locations = await self.repository.get_all()

        result = []
        for location in locations:
            plants_count = await self.repository.count_plants(location.id)
            location_data = LocationWithPlantsCount.model_validate(location)
            location_data.plants_count = plants_count
            result.append(location_data)

        return result

    async def get_location_by_id(self, location_id: UUID) -> LocationResponse:
        """Get a location by ID."""
        location = await self.repository.get_by_id(location_id)
        if not location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Location with id {location_id} not found",
            )
        return LocationResponse.model_validate(location)

    async def get_locations_by_type(self, location_type: str) -> list[LocationResponse]:
        """Get locations by type."""
        if location_type not in ["indoor", "outdoor"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location type must be 'indoor' or 'outdoor'",
            )

        locations = await self.repository.get_by_type(location_type)
        return [LocationResponse.model_validate(loc) for loc in locations]

    async def create_location(self, location_data: LocationCreate) -> LocationResponse:
        """Create a new location."""
        # Validate type
        if location_data.type not in ["indoor", "outdoor"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location type must be 'indoor' or 'outdoor'",
            )

        location = await self.repository.create(location_data)
        return LocationResponse.model_validate(location)

    async def update_location(
        self, location_id: UUID, location_data: LocationUpdate
    ) -> LocationResponse:
        """Update an existing location."""
        # Validate type if provided
        if location_data.type is not None and location_data.type not in ["indoor", "outdoor"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location type must be 'indoor' or 'outdoor'",
            )

        location = await self.repository.update(location_id, location_data)
        if not location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Location with id {location_id} not found",
            )
        return LocationResponse.model_validate(location)

    async def delete_location(self, location_id: UUID) -> None:
        """Delete a location."""
        # Check if location has plants
        plants_count = await self.repository.count_plants(location_id)
        if plants_count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete location with {plants_count} plant(s). Remove plants first.",
            )

        deleted = await self.repository.delete(location_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Location with id {location_id} not found",
            )
