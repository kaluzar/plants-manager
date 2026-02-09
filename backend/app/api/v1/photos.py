"""API endpoints for photo operations."""
from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.photo_service import PhotoService
from app.schemas.photo import PhotoResponse, PhotoUpdate

router = APIRouter(prefix="/photos", tags=["photos"])


@router.get("/{photo_id}", response_model=PhotoResponse)
async def get_photo(
    photo_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a photo by ID."""
    service = PhotoService(db)
    return await service.get_photo_by_id(photo_id)


@router.get("/{photo_id}/file")
async def get_photo_file(
    photo_id: UUID,
    thumbnail: bool = False,
    db: AsyncSession = Depends(get_db),
):
    """Get the actual photo file."""
    service = PhotoService(db)
    photo = await service.get_photo_by_id(photo_id)

    file_path = Path(photo.thumbnail_path if thumbnail and photo.thumbnail_path else photo.file_path)

    if not file_path.exists():
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Photo file not found")

    return FileResponse(file_path, media_type=photo.mime_type)


@router.put("/{photo_id}", response_model=PhotoResponse)
async def update_photo(
    photo_id: UUID,
    photo_data: PhotoUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update photo metadata."""
    service = PhotoService(db)
    return await service.update_photo(photo_id, photo_data)


@router.delete("/{photo_id}", status_code=204)
async def delete_photo(
    photo_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Delete a photo."""
    service = PhotoService(db)
    await service.delete_photo(photo_id)


# Plant-specific photo endpoints
@router.get("/plants/{plant_id}/photos", response_model=list[PhotoResponse])
async def get_plant_photos(
    plant_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get all photos for a plant."""
    service = PhotoService(db)
    return await service.get_plant_photos(plant_id)


@router.post("/plants/{plant_id}/photos", response_model=PhotoResponse, status_code=201)
async def upload_plant_photo(
    plant_id: UUID,
    file: UploadFile = File(...),
    caption: str | None = Form(None),
    db: AsyncSession = Depends(get_db),
):
    """Upload a photo for a plant."""
    service = PhotoService(db)
    return await service.upload_photo(plant_id, file, caption)
