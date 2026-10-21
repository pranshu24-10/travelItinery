from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    day_id = Column(String(36), ForeignKey("itinerary_days.id", ondelete="CASCADE"), nullable=False, index=True)
    trip_id = Column(String(36), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    time_of_day = Column(String(50), default="morning")  # morning, afternoon, evening
    start_time = Column(String(10), nullable=True)  # HH:MM
    end_time = Column(String(10), nullable=True)    # HH:MM
    duration_minutes = Column(Integer, default=90)
    
    location_name = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    category = Column(String(50), default="Sightseeing")  # Sightseeing, Food & Dining, Nature & Adventure, Culture & History, Transport, Relaxation, Shopping, Entertainment
    estimated_cost = Column(Float, default=0.0)
    currency = Column(String(10), default="USD")
    
    transportation_tip = Column(String(255), nullable=True)
    is_booked = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    
    day = relationship("ItineraryDay", back_populates="activities")
