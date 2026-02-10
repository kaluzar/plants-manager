"""Plant API endpoints."""

from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.plant import PlantCreate, PlantResponse, PlantUpdate, PlantWithLocation
from app.schemas.timeline import TimelineItem
from app.services.plant_service import PlantService
from app.services.timeline_service import TimelineService

router = APIRouter()


def get_plant_service(db: AsyncSession = Depends(get_db)) -> PlantService:
    """Dependency to get plant service."""
    return PlantService(db)


@router.get("/", response_model=list[PlantWithLocation])
async def get_plants(
    plant_type: str | None = Query(None, description="Filter by plant type (indoor/outdoor)"),
    category: str | None = Query(
        None, description="Filter by category (flower/tree/grass/other)"
    ),
    location_id: UUID | None = Query(None, description="Filter by location ID"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    service: PlantService = Depends(get_plant_service),
):
    """Get all plants with optional filters."""
    return await service.get_all_plants(
        plant_type=plant_type,
        category=category,
        location_id=location_id,
        skip=skip,
        limit=limit,
    )


@router.get("/search", response_model=list[PlantWithLocation])
async def search_plants(
    q: str = Query(..., min_length=2, description="Search query (name or scientific name)"),
    limit: int = Query(50, ge=1, le=500, description="Maximum number of results"),
    service: PlantService = Depends(get_plant_service),
):
    """Search plants by name or scientific name."""
    return await service.search_plants(q, limit)


@router.get("/by-acquisition-date", response_model=list[PlantWithLocation])
async def get_plants_by_acquisition_date(
    start_date: date = Query(..., description="Start date (inclusive)"),
    end_date: date = Query(..., description="End date (inclusive)"),
    service: PlantService = Depends(get_plant_service),
):
    """Get plants acquired within a date range."""
    return await service.get_plants_by_acquisition_date_range(start_date, end_date)


@router.get("/location/{location_id}", response_model=list[PlantWithLocation])
async def get_plants_by_location(
    location_id: UUID,
    service: PlantService = Depends(get_plant_service),
):
    """Get all plants in a specific location."""
    return await service.get_plants_by_location(location_id)


@router.post("/", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
async def create_plant(
    plant_data: PlantCreate,
    service: PlantService = Depends(get_plant_service),
):
    """Create a new plant."""
    return await service.create_plant(plant_data)


@router.get("/{plant_id}", response_model=PlantWithLocation)
async def get_plant(
    plant_id: UUID,
    service: PlantService = Depends(get_plant_service),
):
    """Get a plant by ID."""
    return await service.get_plant(plant_id)


@router.get("/{plant_id}/timeline", response_model=list[TimelineItem])
async def get_plant_timeline(
    plant_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get timeline of all activities for a plant."""
    timeline_service = TimelineService(db)
    return await timeline_service.get_plant_timeline(plant_id)


@router.put("/{plant_id}", response_model=PlantResponse)
async def update_plant(
    plant_id: UUID,
    plant_data: PlantUpdate,
    service: PlantService = Depends(get_plant_service),
):
    """Update a plant."""
    return await service.update_plant(plant_id, plant_data)


@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_plant(
    plant_id: UUID,
    service: PlantService = Depends(get_plant_service),
):
    """Delete a plant."""
    await service.delete_plant(plant_id)
