-- Personalized Travel Itinerary Planner Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)

-- 1. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    preferred_currency TEXT DEFAULT 'USD',
    preferred_travel_style TEXT DEFAULT 'balanced',
    favorite_interests JSONB DEFAULT '[]'::jsonb,
    dietary_preferences TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 2. TRIPS TABLE
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    destination_country TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 1,
    traveler_type TEXT DEFAULT 'solo',
    traveler_count INTEGER DEFAULT 1,
    total_budget NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    budget_tier TEXT DEFAULT 'moderate',
    interests JSONB DEFAULT '[]'::jsonb,
    travel_style TEXT DEFAULT 'balanced',
    accommodation_type TEXT DEFAULT 'Boutique Hotel',
    transport_mode TEXT DEFAULT 'Mixed',
    dietary_preferences TEXT,
    accessibility_notes TEXT,
    additional_notes TEXT,
    trip_overview TEXT,
    accommodation_recommendations TEXT,
    local_tips JSONB DEFAULT '[]'::jsonb,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_shared BOOLEAN DEFAULT FALSE,
    share_token TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_share_token ON public.trips(share_token);

-- Enable RLS on trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trips"
    ON public.trips FOR SELECT
    USING (auth.uid() = user_id OR (is_shared = true AND share_token IS NOT NULL));

CREATE POLICY "Users can insert their own trips"
    ON public.trips FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
    ON public.trips FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
    ON public.trips FOR DELETE
    USING (auth.uid() = user_id);

-- 3. ITINERARY_DAYS TABLE
CREATE TABLE IF NOT EXISTS public.itinerary_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE,
    theme_title TEXT,
    daily_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON public.itinerary_days(trip_id);

ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view itinerary days of permitted trips"
    ON public.itinerary_days FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = itinerary_days.trip_id
            AND (trips.user_id = auth.uid() OR (trips.is_shared = true AND trips.share_token IS NOT NULL))
        )
    );

CREATE POLICY "Users can manage itinerary days of their own trips"
    ON public.itinerary_days FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = itinerary_days.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- 4. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    time_of_day TEXT DEFAULT 'morning',
    start_time VARCHAR(10) DEFAULT '09:00',
    end_time VARCHAR(10) DEFAULT '11:00',
    duration_minutes INTEGER DEFAULT 90,
    location_name TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    category TEXT DEFAULT 'Sightseeing',
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    transportation_tip TEXT,
    is_booked BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_day_id ON public.activities(day_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_id ON public.activities(trip_id);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities of permitted trips"
    ON public.activities FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = activities.trip_id
            AND (trips.user_id = auth.uid() OR (trips.is_shared = true AND trips.share_token IS NOT NULL))
        )
    );

CREATE POLICY "Users can manage activities of their own trips"
    ON public.activities FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = activities.trip_id
            AND trips.user_id = auth.uid()
        )
    );
