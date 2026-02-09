"""Service for photo operations."""
import os
import uuid
from pathlib import Path
from uuid import UUID

from fastapi import HTTPException, UploadFile
from PIL import Image
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.photo_repository import PhotoRepository
from app.repositories.plant_repository import PlantRepository
from app.schemas.photo import PhotoResponse, PhotoUpdate


class PhotoService:
    """Service for photo business logic."""

    # Configuration
    UPLOAD_DIR = Path("uploads/photos")
    THUMBNAIL_DIR = Path("uploads/thumbnails")
    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    THUMBNAIL_SIZE = (300, 300)

    def __init__(self, db: AsyncSession):
        """Initialize the service."""
        self.db = db
        self.photo_repo = PhotoRepository(db)
        self.plant_repo = PlantRepository(db)

        # Ensure upload directories exist
        self.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        self.THUMBNAIL_DIR.mkdir(parents=True, exist_ok=True)

    async def get_photo_by_id(self, photo_id: UUID) -> PhotoResponse:
        """Get a photo by ID."""
        photo = await self.photo_repo.get_by_id(photo_id)
        if not photo:
            raise HTTPException(status_code=404, detail="Photo not found")
        return PhotoResponse.model_validate(photo)

    async def get_plant_photos(self, plant_id: UUID) -> list[PhotoResponse]:
        """Get all photos for a plant."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        photos = await self.photo_repo.get_by_plant_id(plant_id)
        return [PhotoResponse.model_validate(photo) for photo in photos]

    async def upload_photo(
        self, plant_id: UUID, file: UploadFile, caption: str | None = None
    ) -> PhotoResponse:
        """Upload a photo for a plant."""
        # Verify plant exists
        plant = await self.plant_repo.get_by_id(plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")

        # Validate file extension
        file_ext = Path(file.filename or "").suffix.lower()
        if file_ext not in self.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(self.ALLOWED_EXTENSIONS)}",
            )

        # Read file content
        content = await file.read()
        file_size = len(content)

        # Validate file size
        if file_size > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {self.MAX_FILE_SIZE / (1024 * 1024)}MB",
            )

        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = self.UPLOAD_DIR / unique_filename
        thumbnail_path = self.THUMBNAIL_DIR / f"thumb_{unique_filename}"

        try:
            # Save original file
            with open(file_path, "wb") as f:
                f.write(content)

            # Open image and get dimensions
            with Image.open(file_path) as img:
                width, height = img.size
                mime_type = Image.MIME.get(img.format, file.content_type or "image/jpeg")

                # Create thumbnail
                img.thumbnail(self.THUMBNAIL_SIZE, Image.Resampling.LANCZOS)
                img.save(thumbnail_path, optimize=True, quality=85)

            # Create database record
            photo = await self.photo_repo.create(
                plant_id=plant_id,
                file_path=str(file_path),
                thumbnail_path=str(thumbnail_path),
                original_filename=file.filename or unique_filename,
                file_size=file_size,
                mime_type=mime_type,
                width=width,
                height=height,
                caption=caption,
            )

            return PhotoResponse.model_validate(photo)

        except Exception as e:
            # Clean up files if database operation fails
            if file_path.exists():
                file_path.unlink()
            if thumbnail_path.exists():
                thumbnail_path.unlink()
            raise HTTPException(status_code=500, detail=f"Failed to upload photo: {str(e)}")

    async def update_photo(self, photo_id: UUID, photo_data: PhotoUpdate) -> PhotoResponse:
        """Update photo metadata."""
        photo = await self.photo_repo.update(photo_id, photo_data)
        if not photo:
            raise HTTPException(status_code=404, detail="Photo not found")
        return PhotoResponse.model_validate(photo)

    async def delete_photo(self, photo_id: UUID) -> None:
        """Delete a photo."""
        photo = await self.photo_repo.get_by_id(photo_id)
        if not photo:
            raise HTTPException(status_code=404, detail="Photo not found")

        # Delete files from filesystem
        try:
            file_path = Path(photo.file_path)
            if file_path.exists():
                file_path.unlink()

            if photo.thumbnail_path:
                thumbnail_path = Path(photo.thumbnail_path)
                if thumbnail_path.exists():
                    thumbnail_path.unlink()
        except Exception as e:
            # Log error but continue with database deletion
            print(f"Warning: Failed to delete photo files: {str(e)}")

        # Delete database record
        success = await self.photo_repo.delete(photo_id)
        if not success:
            raise HTTPException(status_code=404, detail="Photo not found")
