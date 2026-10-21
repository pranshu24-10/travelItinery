from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    preferred_currency: str = "USD"
    preferred_travel_style: str = "balanced"
    favorite_interests: List[str] = []
    dietary_preferences: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    preferred_currency: Optional[str] = None
    preferred_travel_style: Optional[str] = None
    favorite_interests: Optional[List[str]] = None
    dietary_preferences: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
