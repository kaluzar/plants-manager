"""Plant database model."""

import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import JSON, Date, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.location import Location
    from app.models.watering import WateringSchedule, WateringLog
    from app.models.fertilization import FertilizationSchedule, FertilizationLog
    from app.models.treatment import Treatment
    from app.models.photo import Photo
    from app.models.growth_log import GrowthLog


class Plant(Base):
    """Plant model."""

    __tablename__ = "plants"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    scientific_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # indoor/outdoor
    category: Mapped[str] = mapped_column(String(50), nullable=False)  # flower/tree/grass/other
    species: Mapped[str | None] = mapped_column(String(100), nullable=True)
    location_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("locations.id", ondelete="SET NULL"), nullable=True
    )
    acquisition_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    extra_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    location: Mapped["Location | None"] = relationship("Location", back_populates="plants")
    watering_schedules: Mapped[list["WateringSchedule"]] = relationship(
        "WateringSchedule", back_populates="plant", cascade="all, delete-orphan"
    )
    watering_logs: Mapped[list["WateringLog"]] = relationship(
        "WateringLog", back_populates="plant", cascade="all, delete-orphan"
    )
    fertilization_schedules: Mapped[list["FertilizationSchedule"]] = relationship(
        "FertilizationSchedule", back_populates="plant", cascade="all, delete-orphan"
    )
    fertilization_logs: Mapped[list["FertilizationLog"]] = relationship(
        "FertilizationLog", back_populates="plant", cascade="all, delete-orphan"
    )
    treatments: Mapped[list["Treatment"]] = relationship(
        "Treatment", back_populates="plant", cascade="all, delete-orphan"
    )
    photos: Mapped[list["Photo"]] = relationship(
        "Photo", back_populates="plant", cascade="all, delete-orphan"
    )
    growth_logs: Mapped[list["GrowthLog"]] = relationship(
        "GrowthLog", back_populates="plant", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Plant(id={self.id}, name={self.name}, type={self.type})>"
