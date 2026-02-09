"""Treatment models for pest and disease management."""
from datetime import date, datetime
import uuid

from sqlalchemy import ForeignKey, String, Text, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Treatment(Base):
    """Treatment for pest or disease issues."""

    __tablename__ = "treatments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    plant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("plants.id", ondelete="CASCADE"), nullable=False
    )
    issue_type: Mapped[str] = mapped_column(String(20), nullable=False)  # pest/disease
    issue_name: Mapped[str] = mapped_column(String(100), nullable=False)
    treatment_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # chemical/organic/manual/biological
    product_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(
        String(20), default="active", nullable=False
    )  # active/completed/cancelled
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    plant: Mapped["Plant"] = relationship("Plant", back_populates="treatments")
    applications: Mapped[list["TreatmentApplication"]] = relationship(
        "TreatmentApplication", back_populates="treatment", cascade="all, delete-orphan"
    )


class TreatmentApplication(Base):
    """Record of a treatment application."""

    __tablename__ = "treatment_applications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    treatment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("treatments.id", ondelete="CASCADE"),
        nullable=False,
    )
    applied_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    amount: Mapped[str | None] = mapped_column(String(100), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    treatment: Mapped["Treatment"] = relationship(
        "Treatment", back_populates="applications"
    )
