"""API endpoints for fertilization operations."""
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.fertilization_service import FertilizationService
from app.schemas.fertilization import (
    FertilizationScheduleCreate,
    FertilizationScheduleUpdate,
    FertilizationScheduleResponse,
    FertilizationScheduleWithNextDate,
    FertilizationLogCreate,
    FertilizationLogResponse,
)

router = APIRouter(prefix="/fertilization", tags=["fertilization"])


# Fertilization Schedule Endpoints
@router.get("/schedules/{schedule_id}", response_model=FertilizationScheduleResponse)
async def get_fertilization_schedule(
    schedule_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a fertilization schedule by ID."""
    service = FertilizationService(db)
    return await service.get_schedule_by_id(schedule_id)


@router.put("/schedules/{schedule_id}", response_model=FertilizationScheduleResponse)
async def update_fertilization_schedule(
    schedule_id: UUID,
    schedule_data: FertilizationScheduleUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a fertilization schedule."""
    service = FertilizationService(db)
    return await service.update_schedule(schedule_id, schedule_data)


@router.delete("/schedules/{schedule_id}", status_code=204)
async def delete_fertilization_schedule(
    schedule_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Delete a fertilization schedule."""
    service = FertilizationService(db)
    await service.delete_schedule(schedule_id)


@router.get(
    "/schedules/{schedule_id}/next-date",
    response_model=FertilizationScheduleWithNextDate,
)
async def get_fertilization_schedule_with_next_date(
    schedule_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a fertilization schedule with calculated next fertilization date."""
    service = FertilizationService(db)
    return await service.get_schedule_with_next_date(schedule_id)


# Fertilization Log Endpoints
@router.delete("/logs/{log_id}", status_code=204)
async def delete_fertilization_log(
    log_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Delete a fertilization log."""
    service = FertilizationService(db)
    await service.delete_log(log_id)


# Due Fertilization Endpoint
@router.get("/due", response_model=list[FertilizationScheduleWithNextDate])
async def get_plants_due_for_fertilization(
    days_ahead: int = Query(0, ge=0, le=30, description="Days ahead to check"),
    db: AsyncSession = Depends(get_db),
):
    """Get plants that are due for fertilization within the specified days ahead."""
    service = FertilizationService(db)
    return await service.get_plants_due_for_fertilization(days_ahead)


# Plant-specific Fertilization Endpoints
@router.get(
    "/plants/{plant_id}/schedules", response_model=list[FertilizationScheduleResponse]
)
async def get_plant_fertilization_schedules(
    plant_id: UUID,
    active_only: bool = Query(False, description="Only return active schedules"),
    db: AsyncSession = Depends(get_db),
):
    """Get all fertilization schedules for a plant."""
    service = FertilizationService(db)
    return await service.get_schedules_by_plant_id(plant_id, active_only)


@router.post(
    "/plants/{plant_id}/schedules",
    response_model=FertilizationScheduleResponse,
    status_code=201,
)
async def create_plant_fertilization_schedule(
    plant_id: UUID,
    schedule_data: FertilizationScheduleCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new fertilization schedule for a plant."""
    # Override plant_id from path
    schedule_data.plant_id = plant_id
    service = FertilizationService(db)
    return await service.create_schedule(schedule_data)


@router.get("/plants/{plant_id}/logs", response_model=list[FertilizationLogResponse])
async def get_plant_fertilization_logs(
    plant_id: UUID,
    limit: int = Query(
        50, ge=1, le=100, description="Maximum number of logs to return"
    ),
    db: AsyncSession = Depends(get_db),
):
    """Get fertilization logs for a plant."""
    service = FertilizationService(db)
    return await service.get_logs_by_plant_id(plant_id, limit)


@router.post(
    "/plants/{plant_id}/logs", response_model=FertilizationLogResponse, status_code=201
)
async def create_plant_fertilization_log(
    plant_id: UUID,
    log_data: FertilizationLogCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new fertilization log entry for a plant."""
    # Override plant_id from path
    log_data.plant_id = plant_id
    service = FertilizationService(db)
    return await service.create_log(log_data)
