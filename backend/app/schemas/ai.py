from typing import List, Optional
from pydantic import BaseModel, Field

class AIActivity(BaseModel):
    title: str = Field(..., description="Name of the activity or attraction")
    description: str = Field(..., description="Vivid, helpful description of the activity and what to experience")
    time_of_day: str = Field("morning", description="morning, afternoon, or evening")
    start_time: str = Field("09:00", description="Estimated start time in HH:MM format")
    end_time: str = Field("11:00", description="Estimated end time in HH:MM format")
    duration_minutes: int = Field(90, description="Estimated duration in minutes")
    location_name: str = Field(..., description="Name of the attraction, neighborhood, or venue")
    latitude: Optional[float] = Field(None, description="Approximate latitude")
    longitude: Optional[float] = Field(None, description="Approximate longitude")
    category: str = Field("Sightseeing", description="Category: Sightseeing, Food & Dining, Nature & Adventure, Culture & History, Transport, Relaxation, Shopping, Entertainment")
    estimated_cost: float = Field(0.0, description="Estimated cost per person or activity in the selected currency")
    transportation_tip: Optional[str] = Field(None, description="Practical guidance on how to get there (e.g. Metro line 1, 10 min walk)")

class AIDay(BaseModel):
    day_number: int
    theme_title: str = Field(..., description="Memorable theme for the day, e.g. 'Historic Highlights & Riverfront Dining'")
    daily_notes: Optional[str] = Field(None, description="Overview or pacing notes for this day")
    activities: List[AIActivity] = Field(..., description="Sequential list of activities for the day")

class AIItineraryResponse(BaseModel):
    trip_title: str
    trip_overview: str = Field(..., description="Compelling, personalized overview of the journey matching user preferences")
    accommodation_recommendations: str = Field(..., description="Recommended neighborhoods, quarters, or hotel styles suited for the travelers")
    local_tips: List[str] = Field(..., description="4-6 actionable practical tips, local etiquette, currency advice, or seasonal notes")
    days: List[AIDay]

class DayRegenerationRequest(BaseModel):
    day_number: int
    additional_guidance: Optional[str] = None
