"""
Dashboard API endpoints
"""

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.dashboard import (
    ActiveTreatment,
    CalendarEvent,
    DueTasks,
    OverviewStats,
    RecentActivity,
)
from app.services.calendar_service import CalendarService
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview", response_model=OverviewStats)
async def get_dashboard_overview(db: AsyncSession = Depends(get_db)):
    """
    Get overview statistics for dashboard
    """
    service = DashboardService(db)
    stats = await service.get_overview_stats()
    return stats


@router.get("/tasks", response_model=DueTasks)
async def get_due_tasks(db: AsyncSession = Depends(get_db)):
    """
    Get all due tasks (watering, fertilization)
    """
    service = DashboardService(db)
    tasks = await service.get_due_tasks()
    return tasks


@router.get("/treatments/active", response_model=list[ActiveTreatment])
async def get_active_treatments(db: AsyncSession = Depends(get_db)):
    """
    Get all active treatments
    """
    service = DashboardService(db)
    treatments = await service.get_active_treatments()
    return treatments


@router.get("/activities/recent", response_model=list[RecentActivity])
async def get_recent_activities(
    limit: int = 10, db: AsyncSession = Depends(get_db)
):
    """
    Get recent activities
    """
    service = DashboardService(db)
    activities = await service.get_recent_activities(limit=limit)
    return activities


@router.get("/calendar", response_model=list[CalendarEvent])
async def get_calendar_events(
    start_date: date = Query(..., description="Start date for calendar range"),
    end_date: date = Query(..., description="End date for calendar range"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all calendar events (watering, fertilization, treatments) for a date range
    """
    service = CalendarService(db)
    events = await service.get_calendar_events(start_date, end_date)
    return events
