"""Timeline schemas for aggregated plant activities."""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class TimelineItem(BaseModel):
    """Timeline item representing a plant activity."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    type: str  # watering, fertilization, treatment_application, treatment_start, treatment_end, growth_log, photo
    timestamp: str  # ISO format datetime string
    title: str
    description: str
    details: dict[str, Any]
