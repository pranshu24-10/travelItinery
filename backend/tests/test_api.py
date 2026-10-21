import os
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.itinerary import ItineraryDay
from app.models.activity import Activity
from main import app

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_travel.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    return TestClient(app)

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_user_registration_and_login(client):
    # Register
    reg_res = client.post("/api/v1/auth/register", json={
        "email": "jane@example.com",
        "password": "SecurePassword123!",
        "full_name": "Jane Traveler"
    })
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == "jane@example.com"
    token = reg_data["access_token"]

    # Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": "jane@example.com",
        "password": "SecurePassword123!"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # Get Profile
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "jane@example.com"

def test_demo_login(client):
    demo_res = client.post("/api/v1/auth/demo")
    assert demo_res.status_code == 200
    data = demo_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "traveler@travelease.demo"

def test_trip_creation_and_ai_fallback(client):
    # Demo login to get token
    demo_res = client.post("/api/v1/auth/demo")
    token = demo_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    trip_payload = {
        "title": "Enchanting Jaipur Tour",
        "destination_city": "Jaipur",
        "destination_country": "India",
        "start_date": "2026-11-01",
        "end_date": "2026-11-04",
        "duration_days": 3,
        "traveler_type": "couple",
        "traveler_count": 2,
        "total_budget": 1200.0,
        "currency": "USD",
        "budget_tier": "moderate",
        "interests": ["Culture & History", "Food & Dining", "Sightseeing"],
        "travel_style": "balanced",
        "accommodation_type": "Heritage Haveli",
        "transport_mode": "Auto & Cabs",
        "dietary_preferences": "Vegetarian options",
        "auto_generate": True
    }

    create_res = client.post("/api/v1/trips", json=trip_payload, headers=headers)
    assert create_res.status_code == 200
    trip = create_res.json()
    assert trip["destination_city"] == "Jaipur"
    assert len(trip["days"]) == 3
    assert len(trip["days"][0]["activities"]) > 0
    trip_id = trip["id"]

    # Get Trip
    get_res = client.get(f"/api/v1/trips/{trip_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == trip_id

    # Budget analytics
    budget_res = client.get(f"/api/v1/trips/{trip_id}/budget", headers=headers)
    assert budget_res.status_code == 200
    budget_data = budget_res.json()
    assert budget_data["total_budget"] == 1200.0
    assert "daily_breakdown" in budget_data
    assert "category_breakdown" in budget_data
    assert len(budget_data["daily_breakdown"]) == 3

def test_trip_ownership_restrictions(client):
    # User 1
    u1_res = client.post("/api/v1/auth/register", json={
        "email": "user1@example.com",
        "password": "Password123!",
        "full_name": "User One"
    })
    token1 = u1_res.json()["access_token"]
    h1 = {"Authorization": f"Bearer {token1}"}

    # User 2
    u2_res = client.post("/api/v1/auth/register", json={
        "email": "user2@example.com",
        "password": "Password123!",
        "full_name": "User Two"
    })
    token2 = u2_res.json()["access_token"]
    h2 = {"Authorization": f"Bearer {token2}"}

    # User 1 creates trip
    trip_res = client.post("/api/v1/trips", json={
        "title": "User 1 Private Trip",
        "destination_city": "Rome",
        "destination_country": "Italy",
        "start_date": "2026-12-01",
        "end_date": "2026-12-03",
        "duration_days": 2,
        "auto_generate": False
    }, headers=h1)
    trip_id = trip_res.json()["id"]

    # User 2 tries to access User 1's trip
    forbidden_res = client.get(f"/api/v1/trips/{trip_id}", headers=h2)
    assert forbidden_res.status_code == 404

    # User 2 tries to delete User 1's trip
    del_res = client.delete(f"/api/v1/trips/{trip_id}", headers=h2)
    assert del_res.status_code == 404

def test_activity_crud_and_sharing(client):
    # Demo login
    demo_res = client.post("/api/v1/auth/demo")
    token = demo_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create trip
    trip_res = client.post("/api/v1/trips", json={
        "title": "Paris Weekend",
        "destination_city": "Paris",
        "destination_country": "France",
        "start_date": "2026-10-25",
        "end_date": "2026-10-27",
        "duration_days": 2,
        "auto_generate": True
    }, headers=headers)
    trip = trip_res.json()
    trip_id = trip["id"]
    day_id = trip["days"][0]["id"]

    # Add custom activity
    add_res = client.post(f"/api/v1/trips/{trip_id}/activities", json={
        "day_id": day_id,
        "trip_id": trip_id,
        "title": "Sunset Crepe Tasting",
        "description": "Authentic buckwheat galettes and sweet Nutella crepes in Montmartre.",
        "time_of_day": "evening",
        "start_time": "18:30",
        "end_time": "20:00",
        "duration_minutes": 90,
        "category": "Food & Dining",
        "estimated_cost": 25.0,
        "currency": "EUR"
    }, headers=headers)
    assert add_res.status_code == 200
    act = add_res.json()
    act_id = act["id"]
    assert act["title"] == "Sunset Crepe Tasting"

    # Update activity
    up_res = client.put(f"/api/v1/activities/{act_id}", json={
        "title": "Artisanal Crepes in Montmartre",
        "estimated_cost": 30.0
    }, headers=headers)
    assert up_res.status_code == 200
    assert up_res.json()["title"] == "Artisanal Crepes in Montmartre"

    # Test Sharing
    share_res = client.post(f"/api/v1/trips/{trip_id}/share", headers=headers)
    assert share_res.status_code == 200
    share_data = share_res.json()
    assert share_data["is_shared"] is True
    share_token = share_data["share_token"]

    # Access shared trip publicly (WITHOUT auth header)
    public_res = client.get(f"/api/v1/shared/{share_token}")
    assert public_res.status_code == 200
    assert public_res.json()["id"] == trip_id

    # Delete activity
    del_act_res = client.delete(f"/api/v1/activities/{act_id}", headers=headers)
    assert del_act_res.status_code == 200

def test_day_regeneration_and_duplicate(client):
    demo_res = client.post("/api/v1/auth/demo")
    token = demo_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create trip
    trip_res = client.post("/api/v1/trips", json={
        "title": "Kyoto Cultural Journey",
        "destination_city": "Kyoto",
        "destination_country": "Japan",
        "start_date": "2026-11-10",
        "end_date": "2026-11-12",
        "duration_days": 2,
        "auto_generate": True
    }, headers=headers)
    trip = trip_res.json()
    trip_id = trip["id"]

    # Regenerate Day 1
    regen_res = client.post(f"/api/v1/trips/{trip_id}/regenerate-day", json={
        "day_number": 1,
        "additional_guidance": "Focus more on peaceful zen gardens and tea ceremonies."
    }, headers=headers)
    assert regen_res.status_code == 200
    updated_trip = regen_res.json()
    assert len(updated_trip["days"]) == 2

    # Duplicate trip
    dup_res = client.post(f"/api/v1/trips/{trip_id}/duplicate", headers=headers)
    assert dup_res.status_code == 200
    dup_trip = dup_res.json()
    assert dup_trip["id"] != trip_id
    assert "(Copy)" in dup_trip["title"]
    assert len(dup_trip["days"]) == 2
