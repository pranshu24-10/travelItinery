export interface User {
  id: string;
  email: string;
  full_name?: string;
  preferred_currency: string;
  preferred_travel_style: string;
  favorite_interests: string[];
  dietary_preferences?: string;
  is_active: boolean;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Activity {
  id: string;
  day_id: string;
  trip_id: string;
  title: string;
  description?: string;
  time_of_day: 'morning' | 'afternoon' | 'evening';
  start_time?: string;
  end_time?: string;
  duration_minutes: number;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  category: string;
  estimated_cost: number;
  currency: string;
  transportation_tip?: string;
  is_booked: boolean;
  order_index: number;
  created_at?: string;
}

export interface ItineraryDay {
  id: string;
  trip_id: string;
  day_number: number;
  date?: string;
  theme_title?: string;
  daily_notes?: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination_city: string;
  destination_country: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  traveler_type: 'solo' | 'couple' | 'family' | 'group';
  traveler_count: number;
  total_budget: number;
  currency: string;
  budget_tier: 'budget' | 'moderate' | 'premium' | 'luxury';
  interests: string[];
  travel_style: 'relaxed' | 'balanced' | 'packed';
  accommodation_type: string;
  transport_mode: string;
  dietary_preferences?: string;
  accessibility_notes?: string;
  additional_notes?: string;
  trip_overview?: string;
  accommodation_recommendations?: string;
  local_tips: string[];
  is_favorite: boolean;
  is_shared: boolean;
  share_token?: string;
  days: ItineraryDay[];
  created_at?: string;
  updated_at?: string;
}

export interface TripListItem {
  id: string;
  title: string;
  destination_city: string;
  destination_country: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  total_budget: number;
  currency: string;
  traveler_count: number;
  is_favorite: boolean;
  is_shared: boolean;
  created_at?: string;
  total_estimated_cost: number;
  activity_count: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface DailyBreakdown {
  day_number: number;
  theme_title: string;
  date?: string;
  estimated_cost: number;
  activity_count: number;
}

export interface BudgetAnalytics {
  total_budget: number;
  currency: string;
  total_estimated_spending: number;
  remaining_budget: number;
  cost_per_traveler: number;
  traveler_count: number;
  is_over_budget: boolean;
  overage_amount: number;
  daily_breakdown: DailyBreakdown[];
  category_breakdown: CategoryBreakdown[];
  disclaimer: string;
}

export interface DestinationCardData {
  id: string;
  name: string;
  country: string;
  state?: string;
  tagline: string;
  category: 'Heritage' | 'Nature' | 'Beaches' | 'Mountains' | 'Urban' | 'Spiritual';
  rating: number;
  reviews_count: number;
  image_url: string;
  estimated_daily_cost: number;
  currency: string;
  highlights: string[];
}

export interface PackageCardData {
  id: string;
  name: string;
  destination: string;
  duration_text: string;
  duration_days: number;
  tier: 'Budget' | 'Moderate' | 'Luxury';
  price_text: string;
  price_value: number;
  currency: string;
  image_url: string;
  rating: number;
  inclusions: string[];
  description: string;
}
