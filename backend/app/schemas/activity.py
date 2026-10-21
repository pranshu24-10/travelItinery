from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    time_of_day: str = "morning"  # morning, afternoon, evening
    start_time: Optional[str] = "09:00"
    end_time: Optional[str] = "11:00"
    duration_minutes: int = 90
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: str = "Sightseeing"
    estimated_cost: float = 0.0
    currency: str = "USD"
    transportation_tip: Optional[str] = None
    is_booked: bool = False
    order_index: int = 0

class ActivityCreate(ActivityBase):
    day_id: str
    trip_id: str

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    time_of_day: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: Optional[str] = None
    estimated_cost: Optional[float] = None
    currency: Optional[str] = None
    transportation_tip: Optional[str] = None
    is_booked: Optional[bool] = None
    order_index: Optional[int] = None

class ActivityResponse(ActivityBase):
    id: str
    day_id: str
    trip_id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
