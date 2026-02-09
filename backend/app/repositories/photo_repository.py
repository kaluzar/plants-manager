"""Repository for photo operations."""
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.photo import Photo
from app.schemas.photo import PhotoCreate, PhotoUpdate


class PhotoRepository:
    """Repository for photo operations."""

    def __init__(self, db: AsyncSession):
        """Initialize the repository."""
        self.db = db

    async def get_by_id(self, photo_id: UUID) -> Photo | None:
        """Get a photo by ID."""
        result = await self.db.execute(select(Photo).where(Photo.id == photo_id))
        return result.scalar_one_or_none()

    async def get_by_plant_id(self, plant_id: UUID) -> list[Photo]:
        """Get all photos for a plant."""
        result = await self.db.execute(
            select(Photo).where(Photo.plant_id == plant_id).order_by(Photo.created_at.desc())
        )
        return list(result.scalars().all())

    async def create(
        self,
        plant_id: UUID,
        file_path: str,
        thumbnail_path: str | None,
        original_filename: str,
        file_size: int,
        mime_type: str,
        width: int | None,
        height: int | None,
        caption: str | None = None,
        taken_at=None,
    ) -> Photo:
        """Create a new photo record."""
        photo = Photo(
            plant_id=plant_id,
            file_path=file_path,
            thumbnail_path=thumbnail_path,
            original_filename=original_filename,
            file_size=file_size,
            mime_type=mime_type,
            width=width,
            height=height,
            caption=caption,
            taken_at=taken_at,
        )
        self.db.add(photo)
        await self.db.commit()
        await self.db.refresh(photo)
        return photo

    async def update(self, photo_id: UUID, photo_data: PhotoUpdate) -> Photo | None:
        """Update a photo."""
        photo = await self.get_by_id(photo_id)
        if not photo:
            return None

        update_data = photo_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(photo, field, value)

        await self.db.commit()
        await self.db.refresh(photo)
        return photo

    async def delete(self, photo_id: UUID) -> bool:
        """Delete a photo."""
        photo = await self.get_by_id(photo_id)
        if not photo:
            return False

        await self.db.delete(photo)
        await self.db.commit()
        return True
