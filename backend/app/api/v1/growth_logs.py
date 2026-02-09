"""API endpoints for growth log operations."""
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.growth_log_service import GrowthLogService
from app.schemas.growth_log import (
    GrowthLogCreate,
    GrowthLogUpdate,
    GrowthLogResponse,
)

router = APIRouter(prefix="/growth", tags=["growth"])


@router.get("/{growth_log_id}", response_model=GrowthLogResponse)
async def get_growth_log(
    growth_log_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a growth log by ID."""
    service = GrowthLogService(db)
    return await service.get_growth_log_by_id(growth_log_id)


@router.put("/{growth_log_id}", response_model=GrowthLogResponse)
async def update_growth_log(
    growth_log_id: UUID,
    growth_log_data: GrowthLogUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a growth log."""
    service = GrowthLogService(db)
    return await service.update_growth_log(growth_log_id, growth_log_data)


@router.delete("/{growth_log_id}", status_code=204)
async def delete_growth_log(
    growth_log_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Delete a growth log."""
    service = GrowthLogService(db)
    await service.delete_growth_log(growth_log_id)


# Plant-specific growth log endpoints
@router.get("/plants/{plant_id}/growth", response_model=list[GrowthLogResponse])
async def get_plant_growth_logs(
    plant_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get all growth logs for a plant."""
    service = GrowthLogService(db)
    return await service.get_plant_growth_logs(plant_id)


@router.post(
    "/plants/{plant_id}/growth", response_model=GrowthLogResponse, status_code=201
)
async def create_plant_growth_log(
    plant_id: UUID,
    growth_log_data: GrowthLogCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new growth log for a plant."""
    # Override plant_id from path
    growth_log_data.plant_id = plant_id
    service = GrowthLogService(db)
    return await service.create_growth_log(growth_log_data)
