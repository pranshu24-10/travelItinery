from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Trip(Base):
    __tablename__ = "trips"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    destination_city = Column(String(255), nullable=False)
    destination_country = Column(String(255), nullable=False)
    
    start_date = Column(String(20), nullable=False)  # ISO YYYY-MM-DD
    end_date = Column(String(20), nullable=False)    # ISO YYYY-MM-DD
    duration_days = Column(Integer, nullable=False, default=1)
    
    traveler_type = Column(String(50), nullable=False, default="solo")  # solo, couple, family, group
    traveler_count = Column(Integer, nullable=False, default=1)
    
    total_budget = Column(Float, nullable=False, default=1000.0)
    currency = Column(String(10), nullable=False, default="USD")
    budget_tier = Column(String(50), nullable=False, default="moderate")  # budget, moderate, premium, luxury
    
    interests = Column(Text, nullable=False, default="[]")  # JSON list
    travel_style = Column(String(50), nullable=False, default="balanced")  # relaxed, balanced, packed
    accommodation_type = Column(String(100), nullable=False, default="Boutique Hotel")
    transport_mode = Column(String(100), nullable=False, default="Mixed")
    dietary_preferences = Column(String(255), nullable=True)
    accessibility_notes = Column(Text, nullable=True)
    additional_notes = Column(Text, nullable=True)
    
    trip_overview = Column(Text, nullable=True)
    accommodation_recommendations = Column(Text, nullable=True)  # JSON or text notes
    local_tips = Column(Text, nullable=True)  # JSON list of tips
    
    is_favorite = Column(Boolean, default=False)
    is_shared = Column(Boolean, default=False)
    share_token = Column(String(64), unique=True, index=True, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    days = relationship("ItineraryDay", back_populates="trip", cascade="all, delete-orphan", order_by="ItineraryDay.day_number")
