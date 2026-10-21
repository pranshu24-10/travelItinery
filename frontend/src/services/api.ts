import { AuthResponse, User, Trip, TripListItem, BudgetAnalytics, Activity, ItineraryDay } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('travelease_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// -------------------------------------------------------------
// STANDALONE / GITHUB PAGES LOCAL STORAGE ENGINE
// Provides 100% functional live demo even when static hosted!
// -------------------------------------------------------------
const INITIAL_DEMO_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'traveler@travelease.demo',
  full_name: 'Alex Morgan (Demo Traveler)',
  preferred_currency: 'USD',
  preferred_travel_style: 'balanced',
  favorite_interests: ['Culture & History', 'Food & Dining', 'Nature & Adventure'],
  dietary_preferences: 'Vegetarian friendly',
  is_active: true,
  created_at: new Date().toISOString()
};

const SAMPLE_INITIAL_TRIPS: Trip[] = [
  {
    id: 'demo-jaipur-trip',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: '3-Day Jaipur Heritage & Palaces Expedition',
    destination_city: 'Jaipur',
    destination_country: 'India',
    start_date: '2026-11-01',
    end_date: '2026-11-04',
    duration_days: 3,
    traveler_type: 'couple',
    traveler_count: 2,
    total_budget: 1200.0,
    currency: 'USD',
    budget_tier: 'moderate',
    interests: ['Culture & History', 'Food & Dining', 'Sightseeing'],
    travel_style: 'balanced',
    accommodation_type: 'Heritage Haveli',
    transport_mode: 'Auto & Cabs',
    dietary_preferences: 'Vegetarian friendly',
    accessibility_notes: 'Standard mobility',
    additional_notes: 'Looking for sunset spots and royal dining',
    trip_overview: 'Experience the regal majesty of the Pink City. This curated 3-day itinerary combines iconic hilltop forts, astrological wonders, vibrant bazaars, and authentic Rajasthani gastronomy with comfortable pacing.',
    accommodation_recommendations: 'Stay in the Civil Lines or C-Scheme quarters for serene heritage havelis with effortless access to both Old City gates and modern dining.',
    local_tips: [
      'Purchase the composite monument ticket to save on entry fees for Amer Fort, Hawa Mahal, and Jantar Mantar.',
      'Best time for photography at Hawa Mahal is early morning around sunrise before bazaar traffic picks up.',
      'Dress modestly when visiting temples and remove shoes before entering sacred sanctums.',
      'Bargain respectfully in Johari Bazaar and Bapu Bazaar for textiles, blue pottery, and jewelry.'
    ],
    is_favorite: true,
    is_shared: true,
    share_token: 'jaipur-heritage-share-demo',
    days: [
      {
        id: 'day-1',
        trip_id: 'demo-jaipur-trip',
        day_number: 1,
        date: '2026-11-01',
        theme_title: 'Day 1: Royal Fortresses & Amber Vistas',
        daily_notes: 'Comfortable walking footwear recommended for exploring palace courtyards and fort ramparts.',
        activities: [
          {
            id: 'act-1-1',
            day_id: 'day-1',
            trip_id: 'demo-jaipur-trip',
            title: 'Amer Fort & Sheesh Mahal Exploration',
            description: 'Marvel at 16th-century Rajput palace architecture, mirror mosaic ceilings in Sheesh Mahal, and panoramic views of Maota Lake.',
            time_of_day: 'morning',
            start_time: '09:00',
            end_time: '11:30',
            duration_minutes: 150,
            location_name: 'Amer, Jaipur',
            latitude: 26.9855,
            longitude: 75.8513,
            category: 'Sightseeing',
            estimated_cost: 25.0,
            currency: 'USD',
            transportation_tip: 'Pre-booked cab or auto-rickshaw (11 km from city center).',
            is_booked: false,
            order_index: 0
          },
          {
            id: 'act-1-2',
            day_id: 'day-1',
            trip_id: 'demo-jaipur-trip',
            title: 'Royal Rajasthani Thali Lunch at 1135 AD',
            description: 'Feast on authentic Dal Baati Churma, Gatte ki Sabzi, and saffron pulao inside the fort ramparts.',
            time_of_day: 'afternoon',
            start_time: '12:30',
            end_time: '14:00',
            duration_minutes: 90,
            location_name: 'Amer Fort Ramparts, Jaipur',
            latitude: 26.9850,
            longitude: 75.8520,
            category: 'Food & Dining',
            estimated_cost: 45.0,
            currency: 'USD',
            transportation_tip: 'Located directly inside the fort complex.',
            is_booked: false,
            order_index: 1
          },
          {
            id: 'act-1-3',
            day_id: 'day-1',
            trip_id: 'demo-jaipur-trip',
            title: 'Sunset at Nahargarh Fort & Padao Cafe',
            description: 'Watch the sun dip below the Aravalli Hills as the Pink City lights up in a glittering twilight expanse.',
            time_of_day: 'evening',
            start_time: '17:00',
            end_time: '19:30',
            duration_minutes: 150,
            location_name: 'Aravalli Hills, Jaipur',
            latitude: 26.9373,
            longitude: 75.8155,
            category: 'Relaxation',
            estimated_cost: 15.0,
            currency: 'USD',
            transportation_tip: '15-minute taxi ride winding through the ridge.',
            is_booked: false,
            order_index: 2
          }
        ]
      },
      {
        id: 'day-2',
        trip_id: 'demo-jaipur-trip',
        day_number: 2,
        date: '2026-11-02',
        theme_title: 'Day 2: City Palace, Observatories & Bazaars',
        daily_notes: 'Immerse in the historic Old Pink City core.',
        activities: [
          {
            id: 'act-2-1',
            day_id: 'day-2',
            trip_id: 'demo-jaipur-trip',
            title: 'Hawa Mahal Sunrise Facade & Rooftop Chai',
            description: 'Photograph the honeycomb pink sandstone facade with 953 jharokha windows with cardamom tea at Tattoo Cafe.',
            time_of_day: 'morning',
            start_time: '08:30',
            end_time: '10:00',
            duration_minutes: 90,
            location_name: 'Badi Choupad, Old City',
            latitude: 26.9239,
            longitude: 75.8267,
            category: 'Sightseeing',
            estimated_cost: 10.0,
            currency: 'USD',
            transportation_tip: 'Direct auto-rickshaw to Badi Choupad.',
            is_booked: false,
            order_index: 0
          },
          {
            id: 'act-2-2',
            day_id: 'day-2',
            trip_id: 'demo-jaipur-trip',
            title: 'City Palace Royal Quarters & Peacock Gate',
            description: 'Explore the blend of Mughal and Rajput architecture, museum collections, and the exquisite courtyard gates.',
            time_of_day: 'afternoon',
            start_time: '11:00',
            end_time: '13:30',
            duration_minutes: 150,
            location_name: 'City Palace Complex, Jaipur',
            latitude: 26.9258,
            longitude: 75.8236,
            category: 'Culture & History',
            estimated_cost: 30.0,
            currency: 'USD',
            transportation_tip: 'Short 5-minute walk from Hawa Mahal.',
            is_booked: false,
            order_index: 1
          },
          {
            id: 'act-2-3',
            day_id: 'day-2',
            trip_id: 'demo-jaipur-trip',
            title: 'Johari Bazaar Evening Artisan & Food Walk',
            description: 'Sample crisp kachoris at Rawat and kulfi falooda while browsing artisan hand-blocked quilts and jewelry.',
            time_of_day: 'evening',
            start_time: '17:30',
            end_time: '20:00',
            duration_minutes: 150,
            location_name: 'Johari Bazaar, Old City',
            latitude: 26.9210,
            longitude: 75.8260,
            category: 'Food & Dining',
            estimated_cost: 20.0,
            currency: 'USD',
            transportation_tip: 'Pedestrian stroll through bazaar streets.',
            is_booked: false,
            order_index: 2
          }
        ]
      },
      {
        id: 'day-3',
        trip_id: 'demo-jaipur-trip',
        day_number: 3,
        date: '2026-11-03',
        theme_title: 'Day 3: Serene Water Palaces & Artisan Workshops',
        daily_notes: 'Relaxed final day picking up keepsakes and enjoying scenic views.',
        activities: [
          {
            id: 'act-3-1',
            day_id: 'day-3',
            trip_id: 'demo-jaipur-trip',
            title: 'Jal Mahal Water Palace Promenade',
            description: 'Admire the 18th-century palace submerged in Man Sagar Lake against the backdrop of the Nahargarh hills.',
            time_of_day: 'morning',
            start_time: '09:30',
            end_time: '11:00',
            duration_minutes: 90,
            location_name: 'Amer Road, Jaipur',
            latitude: 26.9534,
            longitude: 75.8462,
            category: 'Sightseeing',
            estimated_cost: 0.0,
            currency: 'USD',
            transportation_tip: 'Cab along Amer Road.',
            is_booked: false,
            order_index: 0
          },
          {
            id: 'act-3-2',
            day_id: 'day-3',
            trip_id: 'demo-jaipur-trip',
            title: 'Block Printing Workshop at Anokhi Museum',
            description: 'Try your hand at traditional block printing using carved wooden stamps and natural vegetable dyes.',
            time_of_day: 'afternoon',
            start_time: '13:00',
            end_time: '15:30',
            duration_minutes: 150,
            location_name: 'Kheri Gate, Amer',
            latitude: 26.9880,
            longitude: 75.8500,
            category: 'Culture & History',
            estimated_cost: 18.0,
            currency: 'USD',
            transportation_tip: 'Short 10-minute drive from Jal Mahal.',
            is_booked: false,
            order_index: 1
          },
          {
            id: 'act-3-3',
            day_id: 'day-3',
            trip_id: 'demo-jaipur-trip',
            title: 'Farewell Rooftop Dinner at Baradari',
            description: 'Celebrate the journey with contemporary Rajasthani delicacies in the illuminated City Palace courtyard.',
            time_of_day: 'evening',
            start_time: '19:00',
            end_time: '21:30',
            duration_minutes: 150,
            location_name: 'City Palace Courtyard, Jaipur',
            latitude: 26.9255,
            longitude: 75.8240,
            category: 'Food & Dining',
            estimated_cost: 50.0,
            currency: 'USD',
            transportation_tip: 'Taxi to Old City entrance.',
            is_booked: false,
            order_index: 2
          }
        ]
      }
    ]
  }
];

function getLocalTrips(): Trip[] {
  const data = localStorage.getItem('travelease_local_trips');
  if (!data) {
    localStorage.setItem('travelease_local_trips', JSON.stringify(SAMPLE_INITIAL_TRIPS));
    return SAMPLE_INITIAL_TRIPS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return SAMPLE_INITIAL_TRIPS;
  }
}

function saveLocalTrips(trips: Trip[]) {
  localStorage.setItem('travelease_local_trips', JSON.stringify(trips));
}

function computeBudget(trip: Trip): BudgetAnalytics {
  const total = Number(trip.total_budget || 1000);
  const travelers = Math.max(1, Number(trip.traveler_count || 1));
  let activitiesCost = 0;
  const categories: Record<string, number> = {
    'Sightseeing': 0,
    'Food & Dining': 0,
    'Culture & History': 0,
    'Nature & Adventure': 0,
    'Transport': 0,
    'Relaxation': 0,
    'Accommodation': 0,
    'Miscellaneous': 0
  };

  const daily = trip.days.map((d) => {
    let dayCost = 0;
    d.activities.forEach((a) => {
      const c = Number(a.estimated_cost || 0);
      dayCost += c;
      activitiesCost += c;
      if (categories[a.category] !== undefined) {
        categories[a.category] += c;
      } else {
        categories['Miscellaneous'] += c;
      }
    });
    return {
      day_number: d.day_number,
      theme_title: d.theme_title || `Day ${d.day_number}`,
      date: d.date,
      estimated_cost: Math.round(dayCost * 100) / 100,
      activity_count: d.activities.length
    };
  });

  const hotelEst = trip.currency === 'INR' ? 4500 * trip.duration_days : 120 * trip.duration_days;
  categories['Accommodation'] += hotelEst;
  const grandTotal = Math.round((activitiesCost + hotelEst) * 100) / 100;
  const remaining = Math.round((total - grandTotal) * 100) / 100;
  const perTraveler = Math.round((grandTotal / travelers) * 100) / 100;

  const categoryBreakdown = Object.entries(categories)
    .filter(([_, amt]) => amt > 0)
    .map(([cat, amt]) => ({
      category: cat,
      amount: Math.round(amt * 100) / 100,
      percentage: grandTotal > 0 ? Math.round((amt / grandTotal) * 1000) / 10 : 0
    }));

  return {
    total_budget: total,
    currency: trip.currency,
    total_estimated_spending: grandTotal,
    remaining_budget: remaining,
    cost_per_traveler: perTraveler,
    traveler_count: travelers,
    is_over_budget: grandTotal > total,
    overage_amount: grandTotal > total ? Math.round((grandTotal - total) * 100) / 100 : 0,
    daily_breakdown: daily,
    category_breakdown: categoryBreakdown,
    disclaimer: 'All prices are realistic approximations based on market data and selected tier. Real-world bookings are subject to seasonal tariffs.'
  };
}

export const api = {
  // Auth
  async login(email: string, _password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: _password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('travelease_token', data.access_token);
        return data;
      }
    } catch {
      // offline fallback
    }

    // Offline / Demo fallback
    const user: User = {
      ...INITIAL_DEMO_USER,
      email: email,
      full_name: email.split('@')[0]
    };
    const token = 'demo-offline-jwt-token';
    localStorage.setItem('travelease_token', token);
    return { access_token: token, token_type: 'bearer', user };
  },

  async register(email: string, _password: string, fullName?: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: _password, full_name: fullName })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('travelease_token', data.access_token);
        return data;
      }
    } catch {
      // offline fallback
    }

    const user: User = {
      ...INITIAL_DEMO_USER,
      email: email,
      full_name: fullName || email.split('@')[0]
    };
    const token = 'demo-offline-jwt-token';
    localStorage.setItem('travelease_token', token);
    return { access_token: token, token_type: 'bearer', user };
  },

  async loginDemo(): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/demo`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('travelease_token', data.access_token);
        return data;
      }
    } catch {
      // offline fallback
    }

    const token = 'demo-offline-jwt-token';
    localStorage.setItem('travelease_token', token);
    return { access_token: token, token_type: 'bearer', user: INITIAL_DEMO_USER };
  },

  async getMe(): Promise<User> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }
    return INITIAL_DEMO_USER;
  },

  async updateProfile(profile: Partial<User>): Promise<User> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(profile)
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }
    return { ...INITIAL_DEMO_USER, ...profile };
  },

  logout() {
    localStorage.removeItem('travelease_token');
  },

  // Trips
  async createTrip(tripData: any): Promise<Trip> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(tripData)
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    // Offline trip generator
    const newId = `trip-${Date.now()}`;
    const duration = Math.max(1, tripData.duration_days || 3);
    const days: ItineraryDay[] = [];

    const themes = [
      'Historic Foundations & Signature Sights',
      'Artisan Alleys, Local Dining & Cultural Treasures',
      'Panoramic Views, Nature Corridors & Sunset Strolls',
      'Adventure Trails & Riverfront Explorations',
      'Wellness, Markets & Farewell Memories'
    ];

    for (let d = 1; d <= duration; d++) {
      const dayId = `day-${newId}-${d}`;
      const theme = themes[(d - 1) % themes.length];
      const acts: Activity[] = [
        {
          id: `act-${dayId}-1`,
          day_id: dayId,
          trip_id: newId,
          title: `${tripData.destination_city} Historic Highlights & Morning Walk`,
          description: `Discover signature architecture and morning bustling lanes in ${tripData.destination_city}. Capture early photos and local ambiance.`,
          time_of_day: 'morning',
          start_time: '09:00',
          end_time: '11:30',
          duration_minutes: 150,
          location_name: `Central Plaza, ${tripData.destination_city}`,
          latitude: 26.9124 + (d * 0.01),
          longitude: 75.7873 + (d * 0.01),
          category: 'Sightseeing',
          estimated_cost: Math.round(tripData.total_budget * 0.05),
          currency: tripData.currency || 'USD',
          transportation_tip: 'Convenient 10-minute taxi or metro ride.',
          is_booked: false,
          order_index: 0
        },
        {
          id: `act-${dayId}-2`,
          day_id: dayId,
          trip_id: newId,
          title: `Traditional Regional Tasting Lunch`,
          description: `Savor seasonal authentic delicacies and refreshments at a well-regarded local bistro in ${tripData.destination_city}.`,
          time_of_day: 'afternoon',
          start_time: '12:30',
          end_time: '14:00',
          duration_minutes: 90,
          location_name: `Heritage Quarter, ${tripData.destination_city}`,
          latitude: 26.9150 + (d * 0.01),
          longitude: 75.7900 + (d * 0.01),
          category: 'Food & Dining',
          estimated_cost: Math.round(tripData.total_budget * 0.08),
          currency: tripData.currency || 'USD',
          transportation_tip: '5-minute pedestrian stroll.',
          is_booked: false,
          order_index: 1
        },
        {
          id: `act-${dayId}-3`,
          day_id: dayId,
          trip_id: newId,
          title: `Golden Hour Sunset & Evening Promenade`,
          description: `Take in sunset panoramic views across the city skyline, followed by leisurely marketplace browsing.`,
          time_of_day: 'evening',
          start_time: '17:30',
          end_time: '20:00',
          duration_minutes: 150,
          location_name: `Waterfront Promenade, ${tripData.destination_city}`,
          latitude: 26.9080 + (d * 0.01),
          longitude: 75.7820 + (d * 0.01),
          category: 'Relaxation',
          estimated_cost: Math.round(tripData.total_budget * 0.06),
          currency: tripData.currency || 'USD',
          transportation_tip: 'Quick auto-rickshaw or scenic walk.',
          is_booked: false,
          order_index: 2
        }
      ];

      days.push({
        id: dayId,
        trip_id: newId,
        day_number: d,
        date: tripData.start_date,
        theme_title: `Day ${d}: ${theme}`,
        daily_notes: `Focus on comfortable walking and sampling local specialties.`,
        activities: acts
      });
    }

    const createdTrip: Trip = {
      id: newId,
      user_id: INITIAL_DEMO_USER.id,
      title: tripData.title,
      destination_city: tripData.destination_city,
      destination_country: tripData.destination_country,
      start_date: tripData.start_date,
      end_date: tripData.end_date,
      duration_days: duration,
      traveler_type: tripData.traveler_type || 'couple',
      traveler_count: tripData.traveler_count || 2,
      total_budget: tripData.total_budget || 1000,
      currency: tripData.currency || 'USD',
      budget_tier: tripData.budget_tier || 'moderate',
      interests: tripData.interests || [],
      travel_style: tripData.travel_style || 'balanced',
      accommodation_type: tripData.accommodation_type || 'Boutique Hotel',
      transport_mode: tripData.transport_mode || 'Mixed',
      dietary_preferences: tripData.dietary_preferences,
      accessibility_notes: tripData.accessibility_notes,
      additional_notes: tripData.additional_notes,
      trip_overview: `Welcome to your personalized itinerary for ${tripData.destination_city}! Carefully balanced with ${duration} days of sightseeing, authentic gastronomy, and comfortable rest intervals tailored to your ${tripData.travel_style || 'balanced'} pace.`,
      accommodation_recommendations: `We recommend staying in ${tripData.destination_city}'s central heritage district or near major transit corridors for easy access to top attractions.`,
      local_tips: [
        `Pre-download offline maps for ${tripData.destination_city} on your phone for easy navigation.`,
        'Keep small currency notes handy for marketplace vendors and tips.',
        'Book popular monuments in advance during peak travel seasons.',
        'Respect local dress codes at spiritual or heritage sites.'
      ],
      is_favorite: false,
      is_shared: false,
      days: days,
      created_at: new Date().toISOString()
    };

    const currentTrips = getLocalTrips();
    saveLocalTrips([createdTrip, ...currentTrips]);
    return createdTrip;
  },

  async getTrips(_filters?: { status?: string; search?: string; sort?: string }): Promise<TripListItem[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips`, {
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    return localTrips.map((t) => {
      let cost = 0;
      let actCount = 0;
      t.days.forEach((d) => {
        actCount += d.activities.length;
        d.activities.forEach((a) => { cost += (a.estimated_cost || 0); });
      });
      return {
        id: t.id,
        title: t.title,
        destination_city: t.destination_city,
        destination_country: t.destination_country,
        start_date: t.start_date,
        end_date: t.end_date,
        duration_days: t.duration_days,
        total_budget: t.total_budget,
        currency: t.currency,
        traveler_count: t.traveler_count,
        is_favorite: t.is_favorite,
        is_shared: t.is_shared,
        created_at: t.created_at,
        total_estimated_cost: cost,
        activity_count: actCount
      };
    });
  },

  async getTrip(tripId: string): Promise<Trip> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}`, {
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    const found = localTrips.find((t) => t.id === tripId);
    if (!found) throw new Error('Trip not found');
    return found;
  },

  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    const index = localTrips.findIndex((t) => t.id === tripId);
    if (index === -1) throw new Error('Trip not found');
    const updated = { ...localTrips[index], ...updates };
    localTrips[index] = updated;
    saveLocalTrips(localTrips);
    return updated;
  },

  async deleteTrip(tripId: string): Promise<{ status: string; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips().filter((t) => t.id !== tripId);
    saveLocalTrips(localTrips);
    return { status: 'success', message: 'Trip deleted' };
  },

  async toggleFavorite(tripId: string): Promise<Trip> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/favorite`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    const trip = localTrips.find((t) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    trip.is_favorite = !trip.is_favorite;
    saveLocalTrips(localTrips);
    return trip;
  },

  async duplicateTrip(tripId: string): Promise<Trip> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/duplicate`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    const trip = localTrips.find((t) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    const newTrip: Trip = {
      ...JSON.parse(JSON.stringify(trip)),
      id: `trip-copy-${Date.now()}`,
      title: `${trip.title} (Copy)`,
      is_favorite: false,
      is_shared: false
    };
    saveLocalTrips([newTrip, ...localTrips]);
    return newTrip;
  },

  async regenerateEntireTrip(tripId: string): Promise<Trip> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/generate`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    const trip = localTrips.find((t) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    return trip;
  },

  async regenerateDay(tripId: string, dayNumber: number, _guidance?: string): Promise<Trip> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/regenerate-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ day_number: dayNumber, additional_guidance: _guidance })
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    const trip = localTrips.find((t) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    return trip;
  },

  async getTripBudget(tripId: string): Promise<BudgetAnalytics> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/budget`, {
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    const trip = localTrips.find((t) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    return computeBudget(trip);
  },

  // Activities
  async addActivity(tripId: string, activityData: any): Promise<Activity> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(activityData)
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    const trip = localTrips.find((t) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');
    const day = trip.days.find((d) => d.id === activityData.day_id);
    if (!day) throw new Error('Day not found');

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      day_id: activityData.day_id,
      trip_id: tripId,
      title: activityData.title,
      description: activityData.description,
      time_of_day: activityData.time_of_day || 'morning',
      start_time: activityData.start_time || '09:00',
      end_time: activityData.end_time || '10:30',
      duration_minutes: activityData.duration_minutes || 90,
      location_name: activityData.location_name,
      category: activityData.category || 'Sightseeing',
      estimated_cost: Number(activityData.estimated_cost || 0),
      currency: trip.currency,
      transportation_tip: activityData.transportation_tip,
      is_booked: false,
      order_index: day.activities.length
    };
    day.activities.push(newAct);
    saveLocalTrips(localTrips);
    return newAct;
  },

  async updateActivity(activityId: string, updates: Partial<Activity>): Promise<Activity> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    for (const trip of localTrips) {
      for (const day of trip.days) {
        const act = day.activities.find((a) => a.id === activityId);
        if (act) {
          Object.assign(act, updates);
          saveLocalTrips(localTrips);
          return act;
        }
      }
    }
    throw new Error('Activity not found');
  },

  async deleteActivity(activityId: string): Promise<{ status: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/activities/${activityId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    for (const trip of localTrips) {
      for (const day of trip.days) {
        const idx = day.activities.findIndex((a) => a.id === activityId);
        if (idx !== -1) {
          day.activities.splice(idx, 1);
          saveLocalTrips(localTrips);
          return { status: 'success' };
        }
      }
    }
    return { status: 'success' };
  },

  // Sharing
  async enableSharing(tripId: string): Promise<{ is_shared: boolean; share_token: string; share_url: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/share`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const token = `share-${Date.now()}`;
    const localTrips = getLocalTrips();
    const trip = localTrips.find((t) => t.id === tripId);
    if (trip) {
      trip.is_shared = true;
      trip.share_token = token;
      saveLocalTrips(localTrips);
    }
    return { is_shared: true, share_token: token, share_url: `/share/${token}` };
  },

  async disableSharing(tripId: string): Promise<{ is_shared: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/share`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    const trip = localTrips.find((t) => t.id === tripId);
    if (trip) {
      trip.is_shared = false;
      trip.share_token = undefined;
      saveLocalTrips(localTrips);
    }
    return { is_shared: false };
  },

  async getSharedTrip(shareToken: string): Promise<Trip> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/shared/${shareToken}`);
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }

    const localTrips = getLocalTrips();
    const trip = localTrips.find((t) => t.share_token === shareToken);
    if (!trip) throw new Error('Shared trip not found');
    return trip;
  }
};
