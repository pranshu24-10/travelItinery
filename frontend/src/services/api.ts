import { AuthResponse, User, Trip, TripListItem, BudgetAnalytics, Activity } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('travelease_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      errorMsg = data.detail || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse<AuthResponse>(res);
    localStorage.setItem('travelease_token', data.access_token);
    return data;
  },

  async register(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName })
    });
    const data = await handleResponse<AuthResponse>(res);
    localStorage.setItem('travelease_token', data.access_token);
    return data;
  },

  async loginDemo(): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/v1/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await handleResponse<AuthResponse>(res);
    localStorage.setItem('travelease_token', data.access_token);
    return data;
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<User>(res);
  },

  async updateProfile(profile: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/api/v1/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(profile)
    });
    return handleResponse<User>(res);
  },

  logout() {
    localStorage.removeItem('travelease_token');
  },

  // Trips
  async createTrip(tripData: any): Promise<Trip> {
    const res = await fetch(`${API_BASE}/api/v1/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(tripData)
    });
    return handleResponse<Trip>(res);
  },

  async getTrips(filters?: { status?: string; search?: string; sort?: string }): Promise<TripListItem[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/api/v1/trips${query}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<TripListItem[]>(res);
  },

  async getTrip(tripId: string): Promise<Trip> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<Trip>(res);
  },

  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    return handleResponse<Trip>(res);
  },

  async deleteTrip(tripId: string): Promise<{ status: string; message: string }> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse<{ status: string; message: string }>(res);
  },

  async toggleFavorite(tripId: string): Promise<Trip> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/favorite`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse<Trip>(res);
  },

  async duplicateTrip(tripId: string): Promise<Trip> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/duplicate`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse<Trip>(res);
  },

  async regenerateEntireTrip(tripId: string): Promise<Trip> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/generate`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse<Trip>(res);
  },

  async regenerateDay(tripId: string, dayNumber: number, additionalGuidance?: string): Promise<Trip> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/regenerate-day`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ day_number: dayNumber, additional_guidance: additionalGuidance })
    });
    return handleResponse<Trip>(res);
  },

  async getTripBudget(tripId: string): Promise<BudgetAnalytics> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/budget`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<BudgetAnalytics>(res);
  },

  // Activities
  async addActivity(tripId: string, activityData: any): Promise<Activity> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(activityData)
    });
    return handleResponse<Activity>(res);
  },

  async updateActivity(activityId: string, updates: Partial<Activity>): Promise<Activity> {
    const res = await fetch(`${API_BASE}/api/v1/activities/${activityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    return handleResponse<Activity>(res);
  },

  async deleteActivity(activityId: string): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE}/api/v1/activities/${activityId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse<{ status: string }>(res);
  },

  // Sharing
  async enableSharing(tripId: string): Promise<{ is_shared: boolean; share_token: string; share_url: string }> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/share`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse<{ is_shared: boolean; share_token: string; share_url: string }>(res);
  },

  async disableSharing(tripId: string): Promise<{ is_shared: boolean }> {
    const res = await fetch(`${API_BASE}/api/v1/trips/${tripId}/share`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse<{ is_shared: boolean }>(res);
  },

  async getSharedTrip(shareToken: string): Promise<Trip> {
    const res = await fetch(`${API_BASE}/api/v1/shared/${shareToken}`);
    return handleResponse<Trip>(res);
  }
};
