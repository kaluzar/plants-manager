"""
Dashboard Pydantic schemas
"""

from pydantic import BaseModel, ConfigDict


class DueWateringTask(BaseModel):
    """Schema for due watering task"""

    model_config = ConfigDict(from_attributes=True)

    id: str
    plant_id: str
    next_date: str
    frequency_days: int


class DueFertilizationTask(BaseModel):
    """Schema for due fertilization task"""

    model_config = ConfigDict(from_attributes=True)

    id: str
    plant_id: str
    next_date: str
    frequency_days: int


class DueTasks(BaseModel):
    """Schema for all due tasks"""

    due_watering: list[DueWateringTask]
    due_fertilization: list[DueFertilizationTask]


class ActiveTreatment(BaseModel):
    """Schema for active treatment"""

    id: str
    plant_id: str
    issue_type: str
    issue_name: str
    treatment_type: str
    product_name: str | None
    status: str
    start_date: str
    end_date: str | None


class RecentActivity(BaseModel):
    """Schema for recent activity"""

    id: str
    type: str
    plant_id: str
    description: str
    date: str


class OverviewStats(BaseModel):
    """Schema for overview statistics"""

    total_plants: int
    plants_by_type: dict[str, int]
    plants_by_location: dict[str, int]
    active_treatments: int


class CalendarEvent(BaseModel):
    """Schema for calendar event"""

    id: str
    type: str
    plant_id: str
    title: str
    date: str
    details: dict
