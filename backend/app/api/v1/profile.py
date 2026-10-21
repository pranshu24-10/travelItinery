import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse
from app.api.deps import get_current_user
from app.api.v1.auth import user_to_response

router = APIRouter()

@router.get("", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return user_to_response(current_user)

@router.put("", response_model=UserResponse)
def update_profile(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.preferred_currency is not None:
        current_user.preferred_currency = user_in.preferred_currency
    if user_in.preferred_travel_style is not None:
        current_user.preferred_travel_style = user_in.preferred_travel_style
    if user_in.favorite_interests is not None:
        current_user.favorite_interests = json.dumps(user_in.favorite_interests)
    if user_in.dietary_preferences is not None:
        current_user.dietary_preferences = user_in.dietary_preferences
    if user_in.password:
        current_user.hashed_password = get_password_hash(user_in.password)
        
    db.commit()
    db.refresh(current_user)
    return user_to_response(current_user)
