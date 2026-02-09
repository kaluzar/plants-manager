"""API endpoints for watering operations."""
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.watering_service import WateringService
from app.schemas.watering import (
    WateringScheduleCreate,
    WateringScheduleUpdate,
    WateringScheduleResponse,
    WateringScheduleWithNextDate,
    WateringLogCreate,
    WateringLogResponse,
)

router = APIRouter(prefix="/watering", tags=["watering"])


# Watering Schedule Endpoints
@router.get("/schedules/{schedule_id}", response_model=WateringScheduleResponse)
async def get_watering_schedule(
    schedule_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a watering schedule by ID."""
    service = WateringService(db)
    return await service.get_schedule_by_id(schedule_id)


@router.put("/schedules/{schedule_id}", response_model=WateringScheduleResponse)
async def update_watering_schedule(
    schedule_id: UUID,
    schedule_data: WateringScheduleUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a watering schedule."""
    service = WateringService(db)
    return await service.update_schedule(schedule_id, schedule_data)


@router.delete("/schedules/{schedule_id}", status_code=204)
async def delete_watering_schedule(
    schedule_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Delete a watering schedule."""
    service = WateringService(db)
    await service.delete_schedule(schedule_id)


@router.get(
    "/schedules/{schedule_id}/next-date",
    response_model=WateringScheduleWithNextDate,
)
async def get_watering_schedule_with_next_date(
    schedule_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a watering schedule with calculated next watering date."""
    service = WateringService(db)
    return await service.get_schedule_with_next_date(schedule_id)


# Watering Log Endpoints
@router.delete("/logs/{log_id}", status_code=204)
async def delete_watering_log(
    log_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Delete a watering log."""
    service = WateringService(db)
    await service.delete_log(log_id)


# Due Watering Endpoint
@router.get("/due", response_model=list[WateringScheduleWithNextDate])
async def get_plants_due_for_watering(
    days_ahead: int = Query(0, ge=0, le=30, description="Days ahead to check"),
    db: AsyncSession = Depends(get_db),
):
    """Get plants that are due for watering within the specified days ahead."""
    service = WateringService(db)
    return await service.get_plants_due_for_watering(days_ahead)


# Plant-specific Watering Endpoints
@router.get(
    "/plants/{plant_id}/schedules", response_model=list[WateringScheduleResponse]
)
async def get_plant_watering_schedules(
    plant_id: UUID,
    active_only: bool = Query(False, description="Only return active schedules"),
    db: AsyncSession = Depends(get_db),
):
    """Get all watering schedules for a plant."""
    service = WateringService(db)
    return await service.get_schedules_by_plant_id(plant_id, active_only)


@router.post(
    "/plants/{plant_id}/schedules", response_model=WateringScheduleResponse, status_code=201
)
async def create_plant_watering_schedule(
    plant_id: UUID,
    schedule_data: WateringScheduleCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new watering schedule for a plant."""
    # Override plant_id from path
    schedule_data.plant_id = plant_id
    service = WateringService(db)
    return await service.create_schedule(schedule_data)


@router.get("/plants/{plant_id}/logs", response_model=list[WateringLogResponse])
async def get_plant_watering_logs(
    plant_id: UUID,
    limit: int = Query(50, ge=1, le=100, description="Maximum number of logs to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get watering logs for a plant."""
    service = WateringService(db)
    return await service.get_logs_by_plant_id(plant_id, limit)


@router.post(
    "/plants/{plant_id}/logs", response_model=WateringLogResponse, status_code=201
)
async def create_plant_watering_log(
    plant_id: UUID,
    log_data: WateringLogCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new watering log entry for a plant."""
    # Override plant_id from path
    log_data.plant_id = plant_id
    service = WateringService(db)
    return await service.create_log(log_data)
