"""
Calendar service for aggregating scheduled activities
"""

from datetime import date, datetime, timedelta
from uuid import UUID

from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fertilization import FertilizationSchedule
from app.models.treatment import Treatment
from app.models.watering import WateringSchedule
from app.repositories.watering_repository import WateringRepository
from app.repositories.fertilization_repository import FertilizationRepository


class CalendarService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.watering_repo = WateringRepository(db)
        self.fertilization_repo = FertilizationRepository(db)

    async def get_calendar_events(
        self, start_date: date, end_date: date
    ) -> list[dict]:
        """
        Get all calendar events (watering, fertilization, treatments) for a date range
        """
        events = []

        # Get all active watering schedules and calculate their next dates
        active_watering_schedules = await self.watering_repo.get_active_schedules()
        for schedule in active_watering_schedules:
            next_date = await self.watering_repo.calculate_next_watering_date(schedule)
            if next_date and start_date <= next_date <= end_date:
                events.append(
                    {
                        "id": str(schedule.id),
                        "type": "watering",
                        "plant_id": str(schedule.plant_id),
                        "title": "Watering",
                        "date": next_date.isoformat(),
                        "details": {"frequency_days": schedule.frequency_days},
                    }
                )

        # Get all active fertilization schedules and calculate their next dates
        active_fertilization_schedules = (
            await self.fertilization_repo.get_active_schedules()
        )
        for schedule in active_fertilization_schedules:
            next_date = await self.fertilization_repo.calculate_next_fertilization_date(
                schedule
            )
            if next_date and start_date <= next_date <= end_date:
                events.append(
                    {
                        "id": str(schedule.id),
                        "type": "fertilization",
                        "plant_id": str(schedule.plant_id),
                        "title": "Fertilization",
                        "date": next_date.isoformat(),
                        "details": {
                            "frequency_days": schedule.frequency_days,
                            "fertilizer_type": schedule.fertilizer_type,
                        },
                    }
                )

        # Get treatments (both start and end dates)
        treatment_query = select(Treatment).where(
            or_(
                # Treatment start date in range
                and_(
                    Treatment.start_date >= start_date, Treatment.start_date <= end_date
                ),
                # Treatment end date in range
                and_(
                    Treatment.end_date.isnot(None),
                    Treatment.end_date >= start_date,
                    Treatment.end_date <= end_date,
                ),
                # Treatment spans the entire range
                and_(
                    Treatment.start_date <= start_date,
                    or_(
                        Treatment.end_date.is_(None), Treatment.end_date >= end_date
                    ),
                ),
            )
        )
        treatment_result = await self.db.execute(treatment_query)
        treatments = treatment_result.scalars().all()

        for treatment in treatments:
            # Add treatment start event
            if treatment.start_date >= start_date and treatment.start_date <= end_date:
                events.append(
                    {
                        "id": str(treatment.id) + "_start",
                        "type": "treatment_start",
                        "plant_id": str(treatment.plant_id),
                        "title": f"Treatment Start: {treatment.issue_name}",
                        "date": treatment.start_date.isoformat(),
                        "details": {
                            "treatment_id": str(treatment.id),
                            "issue_type": treatment.issue_type,
                            "issue_name": treatment.issue_name,
                            "product_name": treatment.product_name,
                            "status": treatment.status,
                        },
                    }
                )

            # Add treatment end event if it exists and in range
            if (
                treatment.end_date
                and treatment.end_date >= start_date
                and treatment.end_date <= end_date
            ):
                events.append(
                    {
                        "id": str(treatment.id) + "_end",
                        "type": "treatment_end",
                        "plant_id": str(treatment.plant_id),
                        "title": f"Treatment End: {treatment.issue_name}",
                        "date": treatment.end_date.isoformat(),
                        "details": {
                            "treatment_id": str(treatment.id),
                            "issue_type": treatment.issue_type,
                            "issue_name": treatment.issue_name,
                            "product_name": treatment.product_name,
                            "status": treatment.status,
                        },
                    }
                )

        # Sort events by date
        events.sort(key=lambda x: x["date"])

        return events
