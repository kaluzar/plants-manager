"""API v1 router configuration."""

from fastapi import APIRouter

from app.api.v1 import locations, plants, watering, fertilization, treatments, photos, growth_logs, dashboard, notifications

api_router = APIRouter()

# Include resource routers
api_router.include_router(locations.router, prefix="/locations", tags=["locations"])
api_router.include_router(plants.router, prefix="/plants", tags=["plants"])
api_router.include_router(watering.router)
api_router.include_router(fertilization.router)
api_router.include_router(treatments.router)
api_router.include_router(photos.router)
api_router.include_router(growth_logs.router)
api_router.include_router(dashboard.router)
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])


@api_router.get("/")
async def root():
    """API v1 root endpoint."""
    return {
        "message": "Plants Manager API v1",
        "version": "0.1.0",
    }
