"""
Dashboard service for aggregate statistics and overview data
"""

from datetime import date, datetime, timedelta
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fertilization import FertilizationSchedule
from app.models.plant import Plant
from app.models.treatment import Treatment
from app.models.watering import WateringSchedule
from app.repositories.watering_repository import WateringRepository
from app.repositories.fertilization_repository import FertilizationRepository


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.watering_repo = WateringRepository(db)
        self.fertilization_repo = FertilizationRepository(db)

    async def get_overview_stats(self) -> dict:
        """
        Get overview statistics for the dashboard
        """
        # Total plants count
        total_plants_query = select(func.count(Plant.id))
        total_plants_result = await self.db.execute(total_plants_query)
        total_plants = total_plants_result.scalar() or 0

        # Plants by type count
        plants_by_type_query = select(
            Plant.type, func.count(Plant.id)
        ).group_by(Plant.type)
        plants_by_type_result = await self.db.execute(plants_by_type_query)
        plants_by_type = {
            plant_type: count for plant_type, count in plants_by_type_result.all()
        }

        # Plants by location count
        plants_by_location_query = select(
            Plant.location_id, func.count(Plant.id)
        ).group_by(Plant.location_id)
        plants_by_location_result = await self.db.execute(plants_by_location_query)
        plants_by_location = {
            str(location_id): count
            for location_id, count in plants_by_location_result.all()
            if location_id is not None
        }

        # Active treatments count
        active_treatments_query = select(func.count(Treatment.id)).where(
            Treatment.status.in_(["planned", "in_progress"])
        )
        active_treatments_result = await self.db.execute(active_treatments_query)
        active_treatments = active_treatments_result.scalar() or 0

        return {
            "total_plants": total_plants,
            "plants_by_type": plants_by_type,
            "plants_by_location": plants_by_location,
            "active_treatments": active_treatments,
        }

    async def get_due_tasks(self) -> dict:
        """
        Get tasks that are due or overdue
        """
        # Get watering schedules that are due
        due_watering_list = await self.watering_repo.get_plants_due_for_watering(
            days_ahead=0
        )

        # Get fertilization schedules that are due
        due_fertilization_list = await self.fertilization_repo.get_plants_due_for_fertilization(
            days_ahead=0
        )

        return {
            "due_watering": [
                {
                    "id": str(schedule.id),
                    "plant_id": str(schedule.plant_id),
                    "next_date": next_date.isoformat(),
                    "frequency_days": schedule.frequency_days,
                }
                for schedule, next_date in due_watering_list
            ],
            "due_fertilization": [
                {
                    "id": str(schedule.id),
                    "plant_id": str(schedule.plant_id),
                    "next_date": next_date.isoformat(),
                    "frequency_days": schedule.frequency_days,
                }
                for schedule, next_date in due_fertilization_list
            ],
        }

    async def get_active_treatments(self) -> list[dict]:
        """
        Get all active treatments
        """
        query = select(Treatment).where(
            Treatment.status.in_(["planned", "in_progress"])
        )
        result = await self.db.execute(query)
        treatments = result.scalars().all()

        return [
            {
                "id": str(treatment.id),
                "plant_id": str(treatment.plant_id),
                "issue_type": treatment.issue_type,
                "issue_name": treatment.issue_name,
                "treatment_type": treatment.treatment_type,
                "product_name": treatment.product_name,
                "status": treatment.status,
                "start_date": treatment.start_date.isoformat(),
                "end_date": treatment.end_date.isoformat() if treatment.end_date else None,
            }
            for treatment in treatments
        ]

    async def get_recent_activities(self, limit: int = 10) -> list[dict]:
        """
        Get recent activities across all entities
        This is a simplified version - in a real app you might want a separate activity log table
        """
        # For now, we'll return active treatments as recent activities
        # In a full implementation, you'd aggregate across watering logs, fertilization logs,
        # growth logs, photos, etc. with timestamps
        treatments = await self.get_active_treatments()

        # Sort by start_date and limit
        sorted_treatments = sorted(
            treatments, key=lambda x: x["start_date"], reverse=True
        )[:limit]

        return [
            {
                "id": t["id"],
                "type": "treatment",
                "plant_id": t["plant_id"],
                "description": f"{t['issue_type']}: {t['issue_name']} - {t['product_name']}",
                "date": t["start_date"],
            }
            for t in sorted_treatments
        ]
