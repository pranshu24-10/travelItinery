import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.api.deps import get_current_user

router = APIRouter()

def user_to_response(user: User) -> UserResponse:
    interests = []
    if user.favorite_interests:
        try:
            interests = json.loads(user.favorite_interests)
        except Exception:
            interests = []
            
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        preferred_currency=user.preferred_currency,
        preferred_travel_style=user.preferred_travel_style,
        favorite_interests=interests,
        dietary_preferences=user.dietary_preferences,
        is_active=user.is_active,
        created_at=user.created_at
    )

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )
        
    user = User(
        email=user_in.email,
        full_name=user_in.full_name or user_in.email.split("@")[0].capitalize(),
        hashed_password=get_password_hash(user_in.password),
        preferred_currency="USD",
        preferred_travel_style="balanced",
        favorite_interests="[]",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_to_response(user)
    )

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_to_response(user)
    )

@router.post("/demo", response_model=TokenResponse)
def login_demo_user(db: Session = Depends(get_db)):
    """One-click instant login as a demo traveler for evaluator/mentor review."""
    demo_email = "traveler@travelease.demo"
    user = db.query(User).filter(User.email == demo_email).first()
    if not user:
        user = User(
            email=demo_email,
            full_name="Alex Morgan (Demo Traveler)",
            hashed_password=get_password_hash("DemoTraveler2026!"),
            preferred_currency="USD",
            preferred_travel_style="balanced",
            favorite_interests=json.dumps(["Culture & History", "Food & Dining", "Nature & Adventure"]),
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_to_response(user)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return user_to_response(current_user)
