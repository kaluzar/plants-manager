"""Watering models for schedule and logs."""
from datetime import date, datetime
import uuid

from sqlalchemy import ForeignKey, String, Integer, Boolean, Text, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class WateringSchedule(Base):
    """Watering schedule for a plant."""

    __tablename__ = "watering_schedules"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    plant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("plants.id", ondelete="CASCADE"), nullable=False
    )
    frequency_days: Mapped[int] = mapped_column(Integer, nullable=False)
    amount: Mapped[str | None] = mapped_column(String(100), nullable=True)
    time_of_day: Mapped[str | None] = mapped_column(String(50), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    plant: Mapped["Plant"] = relationship("Plant", back_populates="watering_schedules")
    watering_logs: Mapped[list["WateringLog"]] = relationship(
        "WateringLog", back_populates="schedule", cascade="all, delete-orphan"
    )


class WateringLog(Base):
    """Log entry for watering a plant."""

    __tablename__ = "watering_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    plant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("plants.id", ondelete="CASCADE"), nullable=False
    )
    watering_schedule_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("watering_schedules.id", ondelete="SET NULL"),
        nullable=True,
    )
    watered_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    amount: Mapped[str | None] = mapped_column(String(100), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    plant: Mapped["Plant"] = relationship("Plant", back_populates="watering_logs")
    schedule: Mapped["WateringSchedule | None"] = relationship(
        "WateringSchedule", back_populates="watering_logs"
    )
