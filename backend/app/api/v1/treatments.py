"""API endpoints for treatment operations."""
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.treatment_service import TreatmentService
from app.schemas.treatment import (
    TreatmentCreate,
    TreatmentUpdate,
    TreatmentResponse,
    TreatmentWithApplications,
    TreatmentApplicationCreate,
    TreatmentApplicationResponse,
)

router = APIRouter(prefix="/treatments", tags=["treatments"])


# Treatment Endpoints
@router.get("/{treatment_id}", response_model=TreatmentWithApplications)
async def get_treatment(
    treatment_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a treatment by ID with its applications."""
    service = TreatmentService(db)
    return await service.get_treatment_by_id(treatment_id)


@router.put("/{treatment_id}", response_model=TreatmentResponse)
async def update_treatment(
    treatment_id: UUID,
    treatment_data: TreatmentUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a treatment."""
    service = TreatmentService(db)
    return await service.update_treatment(treatment_id, treatment_data)


@router.delete("/{treatment_id}", status_code=204)
async def delete_treatment(
    treatment_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Delete a treatment."""
    service = TreatmentService(db)
    await service.delete_treatment(treatment_id)


# Active Treatments Endpoint
@router.get("/active", response_model=list[TreatmentResponse])
async def get_active_treatments(
    db: AsyncSession = Depends(get_db),
):
    """Get all active treatments across all plants."""
    service = TreatmentService(db)
    return await service.get_active_treatments()


# Treatment Application Endpoints
@router.get(
    "/{treatment_id}/applications", response_model=list[TreatmentApplicationResponse]
)
async def get_treatment_applications(
    treatment_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get all applications for a treatment."""
    service = TreatmentService(db)
    return await service.get_applications_by_treatment_id(treatment_id)


@router.post(
    "/{treatment_id}/applications",
    response_model=TreatmentApplicationResponse,
    status_code=201,
)
async def create_treatment_application(
    treatment_id: UUID,
    application_data: TreatmentApplicationCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new treatment application record."""
    # Override treatment_id from path
    application_data.treatment_id = treatment_id
    service = TreatmentService(db)
    return await service.create_application(application_data)


# Plant-specific Treatment Endpoints
@router.get("/plants/{plant_id}/treatments", response_model=list[TreatmentResponse])
async def get_plant_treatments(
    plant_id: UUID,
    status: str | None = Query(None, description="Filter by status (active/completed/cancelled)"),
    db: AsyncSession = Depends(get_db),
):
    """Get all treatments for a plant."""
    service = TreatmentService(db)
    return await service.get_treatments_by_plant_id(plant_id, status)


@router.post(
    "/plants/{plant_id}/treatments", response_model=TreatmentResponse, status_code=201
)
async def create_plant_treatment(
    plant_id: UUID,
    treatment_data: TreatmentCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new treatment for a plant."""
    # Override plant_id from path
    treatment_data.plant_id = plant_id
    service = TreatmentService(db)
    return await service.create_treatment(treatment_data)
