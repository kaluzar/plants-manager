"""API v1 router configuration."""

from fastapi import APIRouter

api_router = APIRouter()

# TODO: Include routers for each resource
# from app.api.v1 import plants, locations, watering, etc.
# api_router.include_router(plants.router, prefix="/plants", tags=["plants"])


@api_router.get("/")
async def root():
    """API v1 root endpoint."""
    return {
        "message": "Plants Manager API v1",
        "version": "0.1.0",
    }
