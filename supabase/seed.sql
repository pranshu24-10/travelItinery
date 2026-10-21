-- Sample Seed Data for TravelEase / Personalized Travel Itinerary Planner
-- Useful for test environments or Supabase initialization

-- Note: In a live Supabase environment, users are created via Supabase Auth (auth.users).
-- This script provides reproducible demonstration structures.

INSERT INTO public.profiles (id, email, full_name, preferred_currency, preferred_travel_style, favorite_interests, dietary_preferences)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'traveler@travelease.demo', 'Alex Morgan', 'USD', 'balanced', '["Culture & History", "Food & Dining", "Nature & Adventure"]', 'Vegetarian friendly')
ON CONFLICT (id) DO NOTHING;
