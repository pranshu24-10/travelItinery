# REST API Documentation — TravelEase

Base URL: `http://localhost:8000/api/v1`  
Interactive Swagger UI: `http://localhost:8000/docs`  
ReDoc UI: `http://localhost:8000/redoc`

---

## 1. Authentication & User Profile

### `POST /api/v1/auth/register`
Creates a new traveler user account and issues a JWT token.
- **Request Body:**
  ```json
  {
    "email": "traveler@example.com",
    "password": "SecurePassword123!",
    "full_name": "Jane Doe"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "user": {
      "id": "c1f7b820-...",
      "email": "traveler@example.com",
      "full_name": "Jane Doe",
      "preferred_currency": "USD",
      "preferred_travel_style": "balanced",
      "favorite_interests": [],
      "is_active": true
    }
  }
  ```

### `POST /api/v1/auth/login`
Authenticates existing user with email and password.

### `POST /api/v1/auth/demo`
One-click instant login as a demo account (`traveler@travelease.demo`). Ideal for evaluators and presentation reviewers.

### `GET /api/v1/auth/me`
Fetches current authenticated traveler profile. Requires `Authorization: Bearer <token>`.

### `PUT /api/v1/profile`
Updates traveler preferences (currency, travel pace, favorite interests, dietary restrictions).

---

## 2. Trips & Itineraries

### `POST /api/v1/trips`
Creates a new trip and triggers automated AI itinerary generation.
- **Request Body:**
  ```json
  {
    "title": "3-Day Jaipur Heritage Journey",
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
    "interests": ["Culture & History", "Food & Dining"],
    "travel_style": "balanced",
    "accommodation_type": "Heritage Haveli",
    "transport_mode": "Auto & Cabs",
    "auto_generate": true
  }
  ```

### `GET /api/v1/trips`
Lists current traveler's trips with optional search and filtering.
- **Query Parameters:**
  - `status`: `upcoming` | `completed` | `favorites`
  - `search`: Case-insensitive destination or title search
  - `sort`: `newest` | `oldest` | `startDate`

### `GET /api/v1/trips/{trip_id}`
Returns complete trip object with all child `days` and nested `activities`.

### `PUT /api/v1/trips/{trip_id}`
Updates trip title, total budget, currency, or favorite status.

### `DELETE /api/v1/trips/{trip_id}`
Permanently deletes the trip and cascades to all child days and activities.

### `POST /api/v1/trips/{trip_id}/generate`
Regenerates all itinerary days and activities using AI.

### `POST /api/v1/trips/{trip_id}/regenerate-day`
Regenerates an individual day's activities with custom user prompt guidance.
- **Request Body:**
  ```json
  {
    "day_number": 2,
    "additional_guidance": "Focus on peaceful garden walks and traditional tea ceremonies"
  }
  ```

### `POST /api/v1/trips/{trip_id}/duplicate`
Clones an existing trip and all its scheduled activities into a new copy.

### `POST /api/v1/trips/{trip_id}/favorite`
Toggles the favorite bookmark flag.

### `GET /api/v1/trips/{trip_id}/budget`
Computes complete budget analytics including total estimated spending, remaining funds, cost per traveler, daily spending array, and category breakdown for Recharts.

---

## 3. Activities Management

### `POST /api/v1/trips/{trip_id}/activities`
Adds a custom activity to a specified itinerary day.

### `PUT /api/v1/activities/{activity_id}`
Edits an existing activity (title, description, start/end time, cost, category, transport tip).

### `DELETE /api/v1/activities/{activity_id}`
Removes an activity from an itinerary day.

### `POST /api/v1/trips/{trip_id}/reorder-activities`
Synchronizes the reordered sequence of activities within a day.

---

## 4. Public Sharing

### `POST /api/v1/trips/{trip_id}/share`
Generates a secure, 32-character token and activates public read-only access.

### `DELETE /api/v1/trips/{trip_id}/share`
Revokes public sharing.

### `GET /api/v1/shared/{share_token}`
Public endpoint. Returns the itinerary without requiring authentication headers.
