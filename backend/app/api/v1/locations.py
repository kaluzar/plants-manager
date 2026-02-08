"""Location API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.location import LocationCreate, LocationResponse, LocationUpdate, LocationWithPlantsCount
from app.services.location_service import LocationService

router = APIRouter()


def get_location_service(db: AsyncSession = Depends(get_db)) -> LocationService:
    """Dependency to get location service."""
    return LocationService(db)


@router.get("/", response_model=list[LocationWithPlantsCount])
async def get_locations(
    location_type: str | None = None,
    service: LocationService = Depends(get_location_service),
):
    """Get all locations, optionally filtered by type."""
    if location_type:
        return await service.get_locations_by_type(location_type)
    return await service.get_all_locations()


@router.post("/", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
async def create_location(
    location_data: LocationCreate,
    service: LocationService = Depends(get_location_service),
):
    """Create a new location."""
    return await service.create_location(location_data)


@router.get("/{location_id}", response_model=LocationResponse)
async def get_location(
    location_id: UUID,
    service: LocationService = Depends(get_location_service),
):
    """Get a location by ID."""
    return await service.get_location_by_id(location_id)


@router.put("/{location_id}", response_model=LocationResponse)
async def update_location(
    location_id: UUID,
    location_data: LocationUpdate,
    service: LocationService = Depends(get_location_service),
):
    """Update a location."""
    return await service.update_location(location_id, location_data)


@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_location(
    location_id: UUID,
    service: LocationService = Depends(get_location_service),
):
    """Delete a location."""
    await service.delete_location(location_id)
