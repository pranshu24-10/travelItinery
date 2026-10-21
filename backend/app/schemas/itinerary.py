from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.activity import ActivityResponse

class ItineraryDayBase(BaseModel):
    day_number: int
    date: Optional[str] = None
    theme_title: Optional[str] = None
    daily_notes: Optional[str] = None

class ItineraryDayCreate(ItineraryDayBase):
    trip_id: str

class ItineraryDayResponse(ItineraryDayBase):
    id: str
    trip_id: str
    activities: List[ActivityResponse] = []

    model_config = ConfigDict(from_attributes=True)
