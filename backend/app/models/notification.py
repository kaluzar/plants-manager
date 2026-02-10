"""Notification model for in-app notifications."""

from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, String, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class NotificationType(str, Enum):
    """Notification types."""

    WATERING_DUE = "watering_due"
    WATERING_OVERDUE = "watering_overdue"
    FERTILIZATION_DUE = "fertilization_due"
    FERTILIZATION_OVERDUE = "fertilization_overdue"
    TREATMENT_REMINDER = "treatment_reminder"


class Notification(Base):
    """Notification model for in-app notifications."""

    __tablename__ = "notifications"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    type: Mapped[NotificationType] = mapped_column(SQLEnum(NotificationType), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    plant_id: Mapped[UUID] = mapped_column(nullable=True)  # Optional reference to plant
    plant_name: Mapped[str] = mapped_column(String(255), nullable=True)  # Denormalized for quick access
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    read_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    def __repr__(self) -> str:
        return f"<Notification(id={self.id}, type={self.type}, is_read={self.is_read})>"
