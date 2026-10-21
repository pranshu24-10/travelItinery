from typing import List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.itinerary import ItineraryDay
from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse
from app.api.deps import get_current_user

router = APIRouter()

class ReorderItem(BaseModel):
    activity_id: str
    order_index: int

class ReorderRequest(BaseModel):
    day_id: str
    activities: List[ReorderItem]

@router.post("/trips/{trip_id}/activities", response_model=ActivityResponse)
def add_activity(
    trip_id: str,
    act_in: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    day = db.query(ItineraryDay).filter(ItineraryDay.id == act_in.day_id, ItineraryDay.trip_id == trip.id).first()
    if not day:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Itinerary day not found")

    # Get max order_index for this day
    max_order = len(day.activities)

    activity = Activity(
        day_id=day.id,
        trip_id=trip.id,
        title=act_in.title,
        description=act_in.description,
        time_of_day=act_in.time_of_day,
        start_time=act_in.start_time,
        end_time=act_in.end_time,
        duration_minutes=act_in.duration_minutes,
        location_name=act_in.location_name,
        latitude=act_in.latitude,
        longitude=act_in.longitude,
        category=act_in.category,
        estimated_cost=act_in.estimated_cost,
        currency=act_in.currency or trip.currency,
        transportation_tip=act_in.transportation_tip,
        is_booked=act_in.is_booked,
        order_index=max_order
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

@router.put("/activities/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: str,
    act_in: ActivityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    # Verify trip ownership
    trip = db.query(Trip).filter(Trip.id == activity.trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this trip")

    update_data = act_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(activity, field, value)

    db.commit()
    db.refresh(activity)
    return activity

@router.delete("/activities/{activity_id}")
def delete_activity(
    activity_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    # Verify trip ownership
    trip = db.query(Trip).filter(Trip.id == activity.trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this trip")

    db.delete(activity)
    db.commit()
    return {"status": "success", "message": "Activity deleted successfully"}

@router.post("/trips/{trip_id}/reorder-activities")
def reorder_activities(
    trip_id: str,
    reorder_in: ReorderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    for item in reorder_in.activities:
        db.query(Activity).filter(
            Activity.id == item.activity_id,
            Activity.trip_id == trip.id,
            Activity.day_id == reorder_in.day_id
        ).update({"order_index": item.order_index})

    db.commit()
    return {"status": "success", "message": "Activities reordered successfully"}
