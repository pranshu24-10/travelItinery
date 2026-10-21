import json
from typing import Dict, Any

SYSTEM_PROMPT = """You are an elite travel architect and local guide. Your mission is to create a realistic, well-paced, highly personalized day-by-day travel itinerary.

IMPORTANT GUIDELINES:
1. Pacing & Geography: Do not overload days. Group activities geographically in the same neighborhood or along convenient transit corridors to avoid excessive travel.
2. Schedule Balance: Include morning, afternoon, and evening slots with natural meal breaks (lunch and dinner) and rest periods.
3. Realistic Estimates: All costs, travel times, and visit durations are realistic estimates. Make sure estimated costs fit within the user's budget tier and total budget.
4. Dietary & Accessibility: Strictly respect any dietary constraints and accessibility requirements specified.
5. Strict JSON Output: Return strictly valid JSON conforming exactly to the requested schema. Do not output markdown code fences or conversational text outside the JSON object.
"""

def build_itinerary_prompt(trip_data: Dict[str, Any]) -> str:
    interests_str = ", ".join(trip_data.get("interests", [])) if trip_data.get("interests") else "General sightseeing, culture, and local food"
    
    prompt = f"""Generate a personalized {trip_data.get('duration_days', 3)}-day travel itinerary for {trip_data.get('destination_city')}, {trip_data.get('destination_country')}.

TRIP PARAMETERS:
- Destination: {trip_data.get('destination_city')}, {trip_data.get('destination_country')}
- Dates: {trip_data.get('start_date')} to {trip_data.get('end_date')} ({trip_data.get('duration_days')} days)
- Travelers: {trip_data.get('traveler_count')} ({trip_data.get('traveler_type')})
- Total Budget: {trip_data.get('total_budget')} {trip_data.get('currency')} (Tier: {trip_data.get('budget_tier')})
- Key Interests: {interests_str}
- Travel Style & Pace: {trip_data.get('travel_style')}
- Accommodation Preference: {trip_data.get('accommodation_type')}
- Transport Preference: {trip_data.get('transport_mode')}
- Dietary Restrictions: {trip_data.get('dietary_preferences') or 'None specified'}
- Accessibility Notes: {trip_data.get('accessibility_notes') or 'Standard mobility'}
- Special Requests: {trip_data.get('additional_notes') or 'None'}

RESPONSE SCHEMA REQUIREMENT:
Return a JSON object with this exact structure:
{{
  "trip_title": "string (Catchy, evocative title for this personalized journey)",
  "trip_overview": "string (2-3 engaging paragraphs summarizing the trip experience, vibe, and pacing)",
  "accommodation_recommendations": "string (Specific recommended neighborhoods/districts to stay in with rationale)",
  "local_tips": ["string (4 to 6 concise, highly practical tips on local customs, transit passes, etiquette, peak times)"],
  "days": [
    {{
      "day_number": 1,
      "theme_title": "string (Theme of the day, e.g., 'Historic Core & Golden Hour Riverside')",
      "daily_notes": "string (Brief morning briefing or advice for the day)",
      "activities": [
        {{
          "title": "string (Attraction or experience name)",
          "description": "string (2-3 sentences on what to see/do and insider advice)",
          "time_of_day": "morning" | "afternoon" | "evening",
          "start_time": "HH:MM (24-hour format, e.g. 09:30)",
          "end_time": "HH:MM (24-hour format, e.g. 11:30)",
          "duration_minutes": 120,
          "location_name": "string (Place name and district)",
          "latitude": float or null,
          "longitude": float or null,
          "category": "Sightseeing" | "Food & Dining" | "Nature & Adventure" | "Culture & History" | "Transport" | "Relaxation" | "Shopping" | "Entertainment",
          "estimated_cost": float (Estimated cost per person in {trip_data.get('currency')}),
          "transportation_tip": "string (e.g., '10-minute walk from previous spot' or 'Metro Line 4 to Station X')"
        }}
      ]
    }}
  ]
}}

Ensure each day contains 3 to 5 well-spaced activities with realistic meal stops matching the travel pace. Output raw JSON only."""
    return prompt

def build_regenerate_day_prompt(trip_data: Dict[str, Any], day_number: int, additional_guidance: str = "") -> str:
    prompt = f"""Regenerate ONLY Day {day_number} for a trip to {trip_data.get('destination_city')}, {trip_data.get('destination_country')}.

TRIP CONTEXT:
- Destination: {trip_data.get('destination_city')}, {trip_data.get('destination_country')}
- Travelers: {trip_data.get('traveler_count')} ({trip_data.get('traveler_type')})
- Budget Tier: {trip_data.get('budget_tier')} ({trip_data.get('currency')})
- Interests: {', '.join(trip_data.get('interests', []))}
- Travel Style: {trip_data.get('travel_style')}
- Special Guidance for this day: {additional_guidance or 'Provide fresh, exciting alternative activities consistent with the trip profile.'}

RESPONSE SCHEMA REQUIREMENT:
Return a JSON object for just this day:
{{
  "day_number": {day_number},
  "theme_title": "string (Theme of the refreshed day)",
  "daily_notes": "string (Brief notes for this day)",
  "activities": [
    {{
      "title": "string",
      "description": "string",
      "time_of_day": "morning" | "afternoon" | "evening",
      "start_time": "HH:MM",
      "end_time": "HH:MM",
      "duration_minutes": 90,
      "location_name": "string",
      "latitude": float or null,
      "longitude": float or null,
      "category": "Sightseeing" | "Food & Dining" | "Nature & Adventure" | "Culture & History" | "Transport" | "Relaxation" | "Shopping" | "Entertainment",
      "estimated_cost": float,
      "transportation_tip": "string"
    }}
  ]
}}

Output raw JSON only."""
    return prompt
