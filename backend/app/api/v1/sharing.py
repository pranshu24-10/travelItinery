import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.schemas.trip import TripResponse, TripShareResponse
from app.api.deps import get_current_user
from app.api.v1.trips import trip_to_response

router = APIRouter()

@router.post("/trips/{trip_id}/share", response_model=TripShareResponse)
def enable_trip_sharing(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    if not trip.share_token:
        trip.share_token = secrets.token_urlsafe(24)
    trip.is_shared = True
    db.commit()
    db.refresh(trip)

    return TripShareResponse(
        is_shared=True,
        share_token=trip.share_token,
        share_url=f"/share/{trip.share_token}"
    )

@router.delete("/trips/{trip_id}/share", response_model=TripShareResponse)
def disable_trip_sharing(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    trip.is_shared = False
    db.commit()
    db.refresh(trip)

    return TripShareResponse(
        is_shared=False,
        share_token=None,
        share_url=None
    )

@router.get("/shared/{share_token}", response_model=TripResponse)
def get_shared_trip(
    share_token: str,
    db: Session = Depends(get_db)
):
    trip = db.query(Trip).filter(Trip.share_token == share_token, Trip.is_shared == True).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shared itinerary not found or public access has been revoked by the author"
        )
    return trip_to_response(trip)
