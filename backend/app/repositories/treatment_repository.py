"""Repository for treatments and treatment applications."""
from datetime import date
from uuid import UUID

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.treatment import Treatment, TreatmentApplication
from app.schemas.treatment import (
    TreatmentCreate,
    TreatmentUpdate,
    TreatmentApplicationCreate,
)


class TreatmentRepository:
    """Repository for treatment operations."""

    def __init__(self, db: AsyncSession):
        """Initialize the repository."""
        self.db = db

    # Treatment Methods
    async def get_treatment_by_id(self, treatment_id: UUID) -> Treatment | None:
        """Get a treatment by ID."""
        result = await self.db.execute(
            select(Treatment)
            .options(selectinload(Treatment.applications))
            .where(Treatment.id == treatment_id)
        )
        return result.scalar_one_or_none()

    async def get_treatments_by_plant_id(
        self, plant_id: UUID, status: str | None = None
    ) -> list[Treatment]:
        """Get all treatments for a plant, optionally filtered by status."""
        query = (
            select(Treatment)
            .options(selectinload(Treatment.applications))
            .where(Treatment.plant_id == plant_id)
        )

        if status:
            query = query.where(Treatment.status == status)

        result = await self.db.execute(query.order_by(Treatment.created_at.desc()))
        return list(result.scalars().all())

    async def get_active_treatments(self) -> list[Treatment]:
        """Get all active treatments across all plants."""
        result = await self.db.execute(
            select(Treatment)
            .options(selectinload(Treatment.plant))
            .where(Treatment.status == "active")
            .order_by(Treatment.created_at.desc())
        )
        return list(result.scalars().all())

    async def create_treatment(self, treatment_data: TreatmentCreate) -> Treatment:
        """Create a new treatment."""
        treatment = Treatment(**treatment_data.model_dump())
        self.db.add(treatment)
        await self.db.commit()
        await self.db.refresh(treatment)
        return treatment

    async def update_treatment(
        self, treatment_id: UUID, treatment_data: TreatmentUpdate
    ) -> Treatment | None:
        """Update a treatment."""
        treatment = await self.get_treatment_by_id(treatment_id)
        if not treatment:
            return None

        update_data = treatment_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(treatment, field, value)

        await self.db.commit()
        await self.db.refresh(treatment)
        return treatment

    async def delete_treatment(self, treatment_id: UUID) -> bool:
        """Delete a treatment."""
        treatment = await self.get_treatment_by_id(treatment_id)
        if not treatment:
            return False

        await self.db.delete(treatment)
        await self.db.commit()
        return True

    # Treatment Application Methods
    async def get_application_by_id(
        self, application_id: UUID
    ) -> TreatmentApplication | None:
        """Get a treatment application by ID."""
        result = await self.db.execute(
            select(TreatmentApplication).where(
                TreatmentApplication.id == application_id
            )
        )
        return result.scalar_one_or_none()

    async def get_applications_by_treatment_id(
        self, treatment_id: UUID
    ) -> list[TreatmentApplication]:
        """Get all applications for a treatment."""
        result = await self.db.execute(
            select(TreatmentApplication)
            .where(TreatmentApplication.treatment_id == treatment_id)
            .order_by(TreatmentApplication.applied_at.desc())
        )
        return list(result.scalars().all())

    async def create_application(
        self, application_data: TreatmentApplicationCreate
    ) -> TreatmentApplication:
        """Create a new treatment application record."""
        application = TreatmentApplication(**application_data.model_dump())
        self.db.add(application)
        await self.db.commit()
        await self.db.refresh(application)
        return application

    async def delete_application(self, application_id: UUID) -> bool:
        """Delete a treatment application."""
        application = await self.get_application_by_id(application_id)
        if not application:
            return False

        await self.db.delete(application)
        await self.db.commit()
        return True

    # Advanced Queries
    async def get_treatments_by_issue_type(
        self, issue_type: str, active_only: bool = True
    ) -> list[Treatment]:
        """Get treatments filtered by issue type (pest/disease)."""
        query = select(Treatment).where(Treatment.issue_type == issue_type)

        if active_only:
            query = query.where(Treatment.status == "active")

        result = await self.db.execute(query.order_by(Treatment.created_at.desc()))
        return list(result.scalars().all())

    async def get_treatments_by_date_range(
        self, start_date: date, end_date: date
    ) -> list[Treatment]:
        """Get treatments within a date range."""
        result = await self.db.execute(
            select(Treatment)
            .where(
                and_(
                    Treatment.start_date >= start_date, Treatment.start_date <= end_date
                )
            )
            .order_by(Treatment.start_date)
        )
        return list(result.scalars().all())
