"""Service for treatment operations."""
from datetime import date
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.treatment_repository import TreatmentRepository
from app.repositories.plant_repository import PlantRepository
from app.schemas.treatment import (
    TreatmentCreate,
    TreatmentUpdate,
    TreatmentResponse,
    TreatmentWithApplications,
    TreatmentApplicationCreate,
    TreatmentApplicationResponse,
)


class TreatmentService:
    """Service for treatment business logic."""

    VALID_ISSUE_TYPES = ["pest", "disease"]
    VALID_TREATMENT_TYPES = ["chemical", "organic", "manual", "biological"]
    VALID_STATUSES = ["active", "completed", "cancelled"]

    def __init__(self, db: AsyncSession):
        """Initialize the service."""
        self.db = db
        self.treatment_repo = TreatmentRepository(db)
        self.plant_repo = PlantRepository(db)

    # Treatment Methods
    async def get_treatment_by_id(self, treatment_id: UUID) -> TreatmentWithApplications:
        """Get a treatment by ID with its applications."""
        treatment = await self.treatment_repo.get_treatment_by_id(treatment_id)
        if not treatment:
            raise HTTPException(status_code=404, detail="Treatment not found")

        response = TreatmentWithApplications.model_validate(treatment)
        response.applications = [
            TreatmentApplicationResponse.model_validate(app)
            for app in treatment.applications
        ]
        return response

    async def get_treatments_by_plant_id(
        self, plant_id: UUID, status: str | None = None
    ) -> list[TreatmentResponse]:
        """Get all treatments for a plant."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        if status and status not in self.VALID_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(self.VALID_STATUSES)}",
            )

        treatments = await self.treatment_repo.get_treatments_by_plant_id(
            plant_id, status
        )
        return [TreatmentResponse.model_validate(t) for t in treatments]

    async def get_active_treatments(self) -> list[TreatmentResponse]:
        """Get all active treatments across all plants."""
        treatments = await self.treatment_repo.get_active_treatments()
        return [TreatmentResponse.model_validate(t) for t in treatments]

    async def create_treatment(
        self, treatment_data: TreatmentCreate
    ) -> TreatmentResponse:
        """Create a new treatment."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(treatment_data.plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        # Validate issue type
        if treatment_data.issue_type not in self.VALID_ISSUE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid issue type. Must be one of: {', '.join(self.VALID_ISSUE_TYPES)}",
            )

        # Validate treatment type
        if treatment_data.treatment_type not in self.VALID_TREATMENT_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid treatment type. Must be one of: {', '.join(self.VALID_TREATMENT_TYPES)}",
            )

        # Validate date range
        if treatment_data.end_date and treatment_data.end_date < treatment_data.start_date:
            raise HTTPException(
                status_code=400, detail="End date must be after start date"
            )

        # Validate status
        if treatment_data.status not in self.VALID_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(self.VALID_STATUSES)}",
            )

        treatment = await self.treatment_repo.create_treatment(treatment_data)
        return TreatmentResponse.model_validate(treatment)

    async def update_treatment(
        self, treatment_id: UUID, treatment_data: TreatmentUpdate
    ) -> TreatmentResponse:
        """Update a treatment."""
        # Get existing treatment to validate
        existing = await self.treatment_repo.get_treatment_by_id(treatment_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Treatment not found")

        # Validate issue type if provided
        if (
            treatment_data.issue_type
            and treatment_data.issue_type not in self.VALID_ISSUE_TYPES
        ):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid issue type. Must be one of: {', '.join(self.VALID_ISSUE_TYPES)}",
            )

        # Validate treatment type if provided
        if (
            treatment_data.treatment_type
            and treatment_data.treatment_type not in self.VALID_TREATMENT_TYPES
        ):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid treatment type. Must be one of: {', '.join(self.VALID_TREATMENT_TYPES)}",
            )

        # Validate status if provided
        if treatment_data.status and treatment_data.status not in self.VALID_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(self.VALID_STATUSES)}",
            )

        # Validate date range if both dates are provided or updated
        start_date = treatment_data.start_date or existing.start_date
        end_date = (
            treatment_data.end_date
            if treatment_data.end_date is not None
            else existing.end_date
        )

        if end_date and end_date < start_date:
            raise HTTPException(
                status_code=400, detail="End date must be after start date"
            )

        treatment = await self.treatment_repo.update_treatment(
            treatment_id, treatment_data
        )
        if not treatment:
            raise HTTPException(status_code=404, detail="Treatment not found")

        return TreatmentResponse.model_validate(treatment)

    async def delete_treatment(self, treatment_id: UUID) -> None:
        """Delete a treatment."""
        success = await self.treatment_repo.delete_treatment(treatment_id)
        if not success:
            raise HTTPException(status_code=404, detail="Treatment not found")

    # Treatment Application Methods
    async def get_applications_by_treatment_id(
        self, treatment_id: UUID
    ) -> list[TreatmentApplicationResponse]:
        """Get all applications for a treatment."""
        # Verify treatment exists
        treatment = await self.treatment_repo.get_treatment_by_id(treatment_id)
        if not treatment:
            raise HTTPException(status_code=404, detail="Treatment not found")

        applications = await self.treatment_repo.get_applications_by_treatment_id(
            treatment_id
        )
        return [TreatmentApplicationResponse.model_validate(app) for app in applications]

    async def create_application(
        self, application_data: TreatmentApplicationCreate
    ) -> TreatmentApplicationResponse:
        """Create a new treatment application record."""
        # Verify treatment exists
        treatment = await self.treatment_repo.get_treatment_by_id(
            application_data.treatment_id
        )
        if not treatment:
            raise HTTPException(status_code=404, detail="Treatment not found")

        application = await self.treatment_repo.create_application(application_data)
        return TreatmentApplicationResponse.model_validate(application)

    async def delete_application(self, application_id: UUID) -> None:
        """Delete a treatment application."""
        success = await self.treatment_repo.delete_application(application_id)
        if not success:
            raise HTTPException(status_code=404, detail="Treatment application not found")
