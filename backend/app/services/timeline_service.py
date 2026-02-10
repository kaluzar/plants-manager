"""
Timeline service for aggregating plant activities
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.watering import WateringLog
from app.models.fertilization import FertilizationLog
from app.models.treatment import TreatmentApplication, Treatment
from app.models.growth_log import GrowthLog
from app.models.photo import Photo


class TimelineService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_plant_timeline(self, plant_id: UUID) -> list[dict]:
        """
        Get timeline of all activities for a plant, sorted chronologically
        """
        timeline_items = []

        # Get watering logs
        watering_query = (
            select(WateringLog)
            .where(WateringLog.plant_id == plant_id)
            .order_by(WateringLog.watered_at.desc())
        )
        watering_result = await self.db.execute(watering_query)
        watering_logs = watering_result.scalars().all()

        for log in watering_logs:
            timeline_items.append(
                {
                    "id": str(log.id),
                    "type": "watering",
                    "timestamp": log.watered_at.isoformat(),
                    "title": "Watered",
                    "description": f"Amount: {log.amount}" if log.amount else "Watered",
                    "details": {
                        "amount": log.amount,
                        "notes": log.notes,
                    },
                }
            )

        # Get fertilization logs
        fertilization_query = (
            select(FertilizationLog)
            .where(FertilizationLog.plant_id == plant_id)
            .order_by(FertilizationLog.fertilized_at.desc())
        )
        fertilization_result = await self.db.execute(fertilization_query)
        fertilization_logs = fertilization_result.scalars().all()

        for log in fertilization_logs:
            timeline_items.append(
                {
                    "id": str(log.id),
                    "type": "fertilization",
                    "timestamp": log.fertilized_at.isoformat(),
                    "title": "Fertilized",
                    "description": f"Type: {log.fertilizer_type}"
                    if log.fertilizer_type
                    else "Fertilized",
                    "details": {
                        "fertilizer_type": log.fertilizer_type,
                        "amount": log.amount,
                        "notes": log.notes,
                    },
                }
            )

        # Get treatment applications
        treatment_app_query = (
            select(TreatmentApplication, Treatment)
            .join(Treatment, TreatmentApplication.treatment_id == Treatment.id)
            .where(Treatment.plant_id == plant_id)
            .order_by(TreatmentApplication.applied_at.desc())
        )
        treatment_app_result = await self.db.execute(treatment_app_query)
        treatment_applications = treatment_app_result.all()

        for app, treatment in treatment_applications:
            timeline_items.append(
                {
                    "id": str(app.id),
                    "type": "treatment_application",
                    "timestamp": app.applied_at.isoformat(),
                    "title": f"Treatment Applied: {treatment.issue_name}",
                    "description": f"Product: {treatment.product_name}"
                    if treatment.product_name
                    else f"Treating {treatment.issue_name}",
                    "details": {
                        "treatment_id": str(treatment.id),
                        "issue_type": treatment.issue_type,
                        "issue_name": treatment.issue_name,
                        "product_name": treatment.product_name,
                        "notes": app.notes,
                    },
                }
            )

        # Get treatments (start/end events)
        treatment_query = (
            select(Treatment).where(Treatment.plant_id == plant_id).order_by(Treatment.start_date.desc())
        )
        treatment_result = await self.db.execute(treatment_query)
        treatments = treatment_result.scalars().all()

        for treatment in treatments:
            # Treatment start
            timeline_items.append(
                {
                    "id": str(treatment.id) + "_start",
                    "type": "treatment_start",
                    "timestamp": datetime.combine(
                        treatment.start_date, datetime.min.time()
                    ).isoformat(),
                    "title": f"Treatment Started: {treatment.issue_name}",
                    "description": f"{treatment.issue_type} - {treatment.treatment_type}",
                    "details": {
                        "treatment_id": str(treatment.id),
                        "issue_type": treatment.issue_type,
                        "issue_name": treatment.issue_name,
                        "treatment_type": treatment.treatment_type,
                        "product_name": treatment.product_name,
                        "status": treatment.status,
                    },
                }
            )

            # Treatment end
            if treatment.end_date:
                timeline_items.append(
                    {
                        "id": str(treatment.id) + "_end",
                        "type": "treatment_end",
                        "timestamp": datetime.combine(
                            treatment.end_date, datetime.min.time()
                        ).isoformat(),
                        "title": f"Treatment Ended: {treatment.issue_name}",
                        "description": f"Status: {treatment.status}",
                        "details": {
                            "treatment_id": str(treatment.id),
                            "issue_type": treatment.issue_type,
                            "issue_name": treatment.issue_name,
                            "status": treatment.status,
                        },
                    }
                )

        # Get growth logs
        growth_query = (
            select(GrowthLog)
            .where(GrowthLog.plant_id == plant_id)
            .order_by(GrowthLog.measured_at.desc())
        )
        growth_result = await self.db.execute(growth_query)
        growth_logs = growth_result.scalars().all()

        for log in growth_logs:
            measurements = []
            if log.height_cm:
                measurements.append(f"Height: {log.height_cm}cm")
            if log.width_cm:
                measurements.append(f"Width: {log.width_cm}cm")

            description = ", ".join(measurements) if measurements else "Measurement recorded"
            if log.health_status:
                description += f" - {log.health_status.capitalize()}"

            timeline_items.append(
                {
                    "id": str(log.id),
                    "type": "growth_log",
                    "timestamp": log.measured_at.isoformat(),
                    "title": "Growth Measured",
                    "description": description,
                    "details": {
                        "height_cm": log.height_cm,
                        "width_cm": log.width_cm,
                        "health_status": log.health_status,
                        "notes": log.notes,
                        "photo_id": str(log.photo_id) if log.photo_id else None,
                    },
                }
            )

        # Get photos
        photo_query = (
            select(Photo)
            .where(Photo.plant_id == plant_id)
            .order_by(Photo.created_at.desc())
        )
        photo_result = await self.db.execute(photo_query)
        photos = photo_result.scalars().all()

        for photo in photos:
            timeline_items.append(
                {
                    "id": str(photo.id),
                    "type": "photo",
                    "timestamp": photo.created_at.isoformat(),
                    "title": "Photo Added",
                    "description": photo.caption if photo.caption else "Photo uploaded",
                    "details": {
                        "photo_id": str(photo.id),
                        "caption": photo.caption,
                        "file_path": photo.file_path,
                        "thumbnail_path": photo.thumbnail_path,
                    },
                }
            )

        # Sort all timeline items by timestamp (most recent first)
        timeline_items.sort(key=lambda x: x["timestamp"], reverse=True)

        return timeline_items
