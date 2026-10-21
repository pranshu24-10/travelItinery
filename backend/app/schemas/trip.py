from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.schemas.itinerary import ItineraryDayResponse

class TripBase(BaseModel):
    title: str
    destination_city: str
    destination_country: str
    start_date: str
    end_date: str
    duration_days: int = 1
    traveler_type: str = "solo"
    traveler_count: int = 1
    total_budget: float = 1000.0
    currency: str = "USD"
    budget_tier: str = "moderate"
    interests: List[str] = []
    travel_style: str = "balanced"
    accommodation_type: str = "Boutique Hotel"
    transport_mode: str = "Mixed"
    dietary_preferences: Optional[str] = None
    accessibility_notes: Optional[str] = None
    additional_notes: Optional[str] = None

class TripCreate(TripBase):
    auto_generate: bool = True

class TripUpdate(BaseModel):
    title: Optional[str] = None
    total_budget: Optional[float] = None
    currency: Optional[str] = None
    budget_tier: Optional[str] = None
    travel_style: Optional[str] = None
    interests: Optional[List[str]] = None
    is_favorite: Optional[bool] = None
    additional_notes: Optional[str] = None
    accommodation_recommendations: Optional[str] = None
    local_tips: Optional[List[str]] = None

class TripResponse(TripBase):
    id: str
    user_id: str
    trip_overview: Optional[str] = None
    accommodation_recommendations: Optional[str] = None
    local_tips: Optional[List[str]] = []
    is_favorite: bool = False
    is_shared: bool = False
    share_token: Optional[str] = None
    days: List[ItineraryDayResponse] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class TripListResponse(BaseModel):
    id: str
    title: str
    destination_city: str
    destination_country: str
    start_date: str
    end_date: str
    duration_days: int
    total_budget: float
    currency: str
    traveler_count: int
    is_favorite: bool
    is_shared: bool
    created_at: Optional[datetime] = None
    total_estimated_cost: float = 0.0
    activity_count: int = 0

    model_config = ConfigDict(from_attributes=True)

class TripShareResponse(BaseModel):
    is_shared: bool
    share_token: Optional[str] = None
    share_url: Optional[str] = None
