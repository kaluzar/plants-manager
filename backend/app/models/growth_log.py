"""Growth log model for tracking plant growth."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, DateTime, Float, Text, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.plant import Plant
    from app.models.photo import Photo


class GrowthLog(Base):
    """Growth log model for tracking plant measurements and observations."""

    __tablename__ = "growth_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    plant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("plants.id", ondelete="CASCADE"), nullable=False
    )
    photo_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("photos.id", ondelete="SET NULL"), nullable=True
    )
    measured_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    height_cm: Mapped[float | None] = mapped_column(Float, nullable=True)
    width_cm: Mapped[float | None] = mapped_column(Float, nullable=True)
    health_status: Mapped[str | None] = mapped_column(
        String(50), nullable=True
    )  # excellent, good, fair, poor
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    plant: Mapped["Plant"] = relationship("Plant", back_populates="growth_logs")
    photo: Mapped["Photo | None"] = relationship("Photo", back_populates="growth_logs")

    def __repr__(self) -> str:
        return f"<GrowthLog(id={self.id}, plant_id={self.plant_id}, measured_at={self.measured_at})>"
