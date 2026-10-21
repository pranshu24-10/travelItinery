from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class ItineraryDay(Base):
    __tablename__ = "itinerary_days"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id = Column(String(36), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    day_number = Column(Integer, nullable=False)
    date = Column(String(20), nullable=True)  # YYYY-MM-DD
    theme_title = Column(String(255), nullable=True)
    daily_notes = Column(Text, nullable=True)
    
    trip = relationship("Trip", back_populates="days")
    activities = relationship("Activity", back_populates="day", cascade="all, delete-orphan", order_by="Activity.order_index")
