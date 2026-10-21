import json
import uuid
from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.itinerary import ItineraryDay
from app.models.activity import Activity
from app.schemas.trip import TripCreate, TripUpdate, TripResponse, TripListResponse
from app.schemas.ai import DayRegenerationRequest
from app.api.deps import get_current_user
from app.services.ai_service import generate_itinerary, regenerate_day
from app.services.budget_service import calculate_trip_budget_analytics

router = APIRouter()

def trip_to_response(trip: Trip) -> TripResponse:
    interests = []
    if trip.interests:
        try:
            interests = json.loads(trip.interests)
        except Exception:
            interests = []
            
    local_tips = []
    if trip.local_tips:
        try:
            local_tips = json.loads(trip.local_tips)
        except Exception:
            local_tips = []

    return TripResponse(
        id=trip.id,
        user_id=trip.user_id,
        title=trip.title,
        destination_city=trip.destination_city,
        destination_country=trip.destination_country,
        start_date=trip.start_date,
        end_date=trip.end_date,
        duration_days=trip.duration_days,
        traveler_type=trip.traveler_type,
        traveler_count=trip.traveler_count,
        total_budget=trip.total_budget,
        currency=trip.currency,
        budget_tier=trip.budget_tier,
        interests=interests,
        travel_style=trip.travel_style,
        accommodation_type=trip.accommodation_type,
        transport_mode=trip.transport_mode,
        dietary_preferences=trip.dietary_preferences,
        accessibility_notes=trip.accessibility_notes,
        additional_notes=trip.additional_notes,
        trip_overview=trip.trip_overview,
        accommodation_recommendations=trip.accommodation_recommendations,
        local_tips=local_tips,
        is_favorite=trip.is_favorite,
        is_shared=trip.is_shared,
        share_token=trip.share_token,
        days=trip.days,
        created_at=trip.created_at,
        updated_at=trip.updated_at
    )

@router.post("", response_model=TripResponse)
async def create_trip(
    trip_in: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = Trip(
        user_id=current_user.id,
        title=trip_in.title,
        destination_city=trip_in.destination_city,
        destination_country=trip_in.destination_country,
        start_date=trip_in.start_date,
        end_date=trip_in.end_date,
        duration_days=trip_in.duration_days,
        traveler_type=trip_in.traveler_type,
        traveler_count=trip_in.traveler_count,
        total_budget=trip_in.total_budget,
        currency=trip_in.currency,
        budget_tier=trip_in.budget_tier,
        interests=json.dumps(trip_in.interests),
        travel_style=trip_in.travel_style,
        accommodation_type=trip_in.accommodation_type,
        transport_mode=trip_in.transport_mode,
        dietary_preferences=trip_in.dietary_preferences,
        accessibility_notes=trip_in.accessibility_notes,
        additional_notes=trip_in.additional_notes,
        is_favorite=False,
        is_shared=False
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)

    if trip_in.auto_generate:
        trip_dict = trip_in.model_dump()
        ai_result = await generate_itinerary(trip_dict)
        
        trip.trip_overview = ai_result.trip_overview
        trip.accommodation_recommendations = ai_result.accommodation_recommendations
        trip.local_tips = json.dumps(ai_result.local_tips)
        
        # Populate itinerary days and activities
        for day_data in ai_result.days:
            # Calculate date for the day
            try:
                base_dt = datetime.strptime(trip.start_date, "%Y-%m-%d")
                day_dt = base_dt + timedelta(days=day_data.day_number - 1)
                date_str = day_dt.strftime("%Y-%m-%d")
            except Exception:
                date_str = None

            day_row = ItineraryDay(
                trip_id=trip.id,
                day_number=day_data.day_number,
                date=date_str,
                theme_title=day_data.theme_title,
                daily_notes=day_data.daily_notes
            )
            db.add(day_row)
            db.commit()
            db.refresh(day_row)
            
            for idx, act in enumerate(day_data.activities):
                act_row = Activity(
                    day_id=day_row.id,
                    trip_id=trip.id,
                    title=act.title,
                    description=act.description,
                    time_of_day=act.time_of_day,
                    start_time=act.start_time,
                    end_time=act.end_time,
                    duration_minutes=act.duration_minutes,
                    location_name=act.location_name,
                    latitude=act.latitude,
                    longitude=act.longitude,
                    category=act.category,
                    estimated_cost=act.estimated_cost,
                    currency=trip.currency,
                    transportation_tip=act.transportation_tip,
                    order_index=idx
                )
                db.add(act_row)
            db.commit()

        db.refresh(trip)

    return trip_to_response(trip)

@router.get("", response_model=List[TripListResponse])
def get_user_trips(
    status_filter: Optional[str] = Query(None, alias="status"), # "upcoming", "completed", "favorites"
    search: Optional[str] = Query(None),
    sort: Optional[str] = Query("newest"), # "newest", "oldest", "startDate"
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Trip).filter(Trip.user_id == current_user.id)
    
    if search:
        search_fmt = f"%{search.strip().lower()}%"
        query = query.filter(
            (Trip.title.ilike(search_fmt)) |
            (Trip.destination_city.ilike(search_fmt)) |
            (Trip.destination_country.ilike(search_fmt))
        )
        
    if status_filter == "favorites":
        query = query.filter(Trip.is_favorite == True)
        
    if sort == "oldest":
        query = query.order_by(Trip.created_at.asc())
    elif sort == "startDate":
        query = query.order_by(Trip.start_date.asc())
    else:
        query = query.order_by(Trip.created_at.desc())
        
    trips = query.all()
    
    today_str = date.today().isoformat()
    results: List[TripListResponse] = []
    
    for t in trips:
        # Check upcoming vs completed
        if status_filter == "upcoming" and t.end_date < today_str:
            continue
        if status_filter == "completed" and t.end_date >= today_str:
            continue
            
        total_cost = 0.0
        act_count = 0
        for day in t.days:
            act_count += len(day.activities)
            for act in day.activities:
                total_cost += (act.estimated_cost or 0.0)
                
        results.append(TripListResponse(
            id=t.id,
            title=t.title,
            destination_city=t.destination_city,
            destination_country=t.destination_country,
            start_date=t.start_date,
            end_date=t.end_date,
            duration_days=t.duration_days,
            total_budget=t.total_budget,
            currency=t.currency,
            traveler_count=t.traveler_count,
            is_favorite=t.is_favorite,
            is_shared=t.is_shared,
            created_at=t.created_at,
            total_estimated_cost=round(total_cost, 2),
            activity_count=act_count
        ))
        
    return results

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found or you do not have permission to access it"
        )
    return trip_to_response(trip)

@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: str,
    trip_in: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
        
    if trip_in.title is not None:
        trip.title = trip_in.title
    if trip_in.total_budget is not None:
        trip.total_budget = trip_in.total_budget
    if trip_in.currency is not None:
        trip.currency = trip_in.currency
    if trip_in.budget_tier is not None:
        trip.budget_tier = trip_in.budget_tier
    if trip_in.travel_style is not None:
        trip.travel_style = trip_in.travel_style
    if trip_in.interests is not None:
        trip.interests = json.dumps(trip_in.interests)
    if trip_in.is_favorite is not None:
        trip.is_favorite = trip_in.is_favorite
    if trip_in.additional_notes is not None:
        trip.additional_notes = trip_in.additional_notes
    if trip_in.accommodation_recommendations is not None:
        trip.accommodation_recommendations = trip_in.accommodation_recommendations
    if trip_in.local_tips is not None:
        trip.local_tips = json.dumps(trip_in.local_tips)

    db.commit()
    db.refresh(trip)
    return trip_to_response(trip)

@router.delete("/{trip_id}")
def delete_trip(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
        
    db.delete(trip)
    db.commit()
    return {"status": "success", "message": "Trip successfully deleted"}

@router.post("/{trip_id}/favorite", response_model=TripResponse)
def toggle_favorite(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
        
    trip.is_favorite = not trip.is_favorite
    db.commit()
    db.refresh(trip)
    return trip_to_response(trip)

@router.post("/{trip_id}/duplicate", response_model=TripResponse)
def duplicate_trip(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
        
    new_trip = Trip(
        user_id=current_user.id,
        title=f"{trip.title} (Copy)",
        destination_city=trip.destination_city,
        destination_country=trip.destination_country,
        start_date=trip.start_date,
        end_date=trip.end_date,
        duration_days=trip.duration_days,
        traveler_type=trip.traveler_type,
        traveler_count=trip.traveler_count,
        total_budget=trip.total_budget,
        currency=trip.currency,
        budget_tier=trip.budget_tier,
        interests=trip.interests,
        travel_style=trip.travel_style,
        accommodation_type=trip.accommodation_type,
        transport_mode=trip.transport_mode,
        dietary_preferences=trip.dietary_preferences,
        accessibility_notes=trip.accessibility_notes,
        additional_notes=trip.additional_notes,
        trip_overview=trip.trip_overview,
        accommodation_recommendations=trip.accommodation_recommendations,
        local_tips=trip.local_tips,
        is_favorite=False,
        is_shared=False
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    
    # Duplicate days and activities
    for day in trip.days:
        new_day = ItineraryDay(
            trip_id=new_trip.id,
            day_number=day.day_number,
            date=day.date,
            theme_title=day.theme_title,
            daily_notes=day.daily_notes
        )
        db.add(new_day)
        db.commit()
        db.refresh(new_day)
        
        for act in day.activities:
            new_act = Activity(
                day_id=new_day.id,
                trip_id=new_trip.id,
                title=act.title,
                description=act.description,
                time_of_day=act.time_of_day,
                start_time=act.start_time,
                end_time=act.end_time,
                duration_minutes=act.duration_minutes,
                location_name=act.location_name,
                latitude=act.latitude,
                longitude=act.longitude,
                category=act.category,
                estimated_cost=act.estimated_cost,
                currency=act.currency,
                transportation_tip=act.transportation_tip,
                order_index=act.order_index
            )
            db.add(new_act)
        db.commit()

    db.refresh(new_trip)
    return trip_to_response(new_trip)

@router.post("/{trip_id}/generate", response_model=TripResponse)
async def regenerate_entire_trip(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    interests = []
    if trip.interests:
        try:
            interests = json.loads(trip.interests)
        except Exception:
            interests = []

    trip_data = {
        "destination_city": trip.destination_city,
        "destination_country": trip.destination_country,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "duration_days": trip.duration_days,
        "traveler_type": trip.traveler_type,
        "traveler_count": trip.traveler_count,
        "total_budget": trip.total_budget,
        "currency": trip.currency,
        "budget_tier": trip.budget_tier,
        "interests": interests,
        "travel_style": trip.travel_style,
        "accommodation_type": trip.accommodation_type,
        "transport_mode": trip.transport_mode,
        "dietary_preferences": trip.dietary_preferences,
        "accessibility_notes": trip.accessibility_notes,
        "additional_notes": trip.additional_notes
    }

    ai_result = await generate_itinerary(trip_data)

    # Delete existing days and activities
    db.query(ItineraryDay).filter(ItineraryDay.trip_id == trip.id).delete()
    
    trip.trip_overview = ai_result.trip_overview
    trip.accommodation_recommendations = ai_result.accommodation_recommendations
    trip.local_tips = json.dumps(ai_result.local_tips)
    db.commit()

    for day_data in ai_result.days:
        try:
            base_dt = datetime.strptime(trip.start_date, "%Y-%m-%d")
            day_dt = base_dt + timedelta(days=day_data.day_number - 1)
            date_str = day_dt.strftime("%Y-%m-%d")
        except Exception:
            date_str = None

        day_row = ItineraryDay(
            trip_id=trip.id,
            day_number=day_data.day_number,
            date=date_str,
            theme_title=day_data.theme_title,
            daily_notes=day_data.daily_notes
        )
        db.add(day_row)
        db.commit()
        db.refresh(day_row)

        for idx, act in enumerate(day_data.activities):
            act_row = Activity(
                day_id=day_row.id,
                trip_id=trip.id,
                title=act.title,
                description=act.description,
                time_of_day=act.time_of_day,
                start_time=act.start_time,
                end_time=act.end_time,
                duration_minutes=act.duration_minutes,
                location_name=act.location_name,
                latitude=act.latitude,
                longitude=act.longitude,
                category=act.category,
                estimated_cost=act.estimated_cost,
                currency=trip.currency,
                transportation_tip=act.transportation_tip,
                order_index=idx
            )
            db.add(act_row)
        db.commit()

    db.refresh(trip)
    return trip_to_response(trip)

@router.post("/{trip_id}/regenerate-day", response_model=TripResponse)
async def regenerate_trip_day(
    trip_id: str,
    req: DayRegenerationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    day_row = db.query(ItineraryDay).filter(
        ItineraryDay.trip_id == trip.id,
        ItineraryDay.day_number == req.day_number
    ).first()
    if not day_row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Day {req.day_number} not found for this trip")

    interests = []
    if trip.interests:
        try:
            interests = json.loads(trip.interests)
        except Exception:
            interests = []

    trip_data = {
        "destination_city": trip.destination_city,
        "destination_country": trip.destination_country,
        "duration_days": trip.duration_days,
        "traveler_type": trip.traveler_type,
        "traveler_count": trip.traveler_count,
        "total_budget": trip.total_budget,
        "currency": trip.currency,
        "budget_tier": trip.budget_tier,
        "interests": interests,
        "travel_style": trip.travel_style
    }

    new_day_data = await regenerate_day(trip_data, req.day_number, req.additional_guidance or "")

    # Update day details
    day_row.theme_title = new_day_data.theme_title
    day_row.daily_notes = new_day_data.daily_notes

    # Clear existing activities for this day
    db.query(Activity).filter(Activity.day_id == day_row.id).delete()

    for idx, act in enumerate(new_day_data.activities):
        act_row = Activity(
            day_id=day_row.id,
            trip_id=trip.id,
            title=act.title,
            description=act.description,
            time_of_day=act.time_of_day,
            start_time=act.start_time,
            end_time=act.end_time,
            duration_minutes=act.duration_minutes,
            location_name=act.location_name,
            latitude=act.latitude,
            longitude=act.longitude,
            category=act.category,
            estimated_cost=act.estimated_cost,
            currency=trip.currency,
            transportation_tip=act.transportation_tip,
            order_index=idx
        )
        db.add(act_row)

    db.commit()
    db.refresh(trip)
    return trip_to_response(trip)

@router.get("/{trip_id}/budget")
def get_trip_budget(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
        
    return calculate_trip_budget_analytics(trip)
