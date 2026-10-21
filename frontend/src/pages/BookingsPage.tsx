import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { TripListItem } from '../types';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  Copy, 
  Trash2, 
  Search, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'startDate'>('newest');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await api.getTrips({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search.trim() || undefined,
        sort: sortBy
      });
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [statusFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips();
  };

  const handleToggleFavorite = async (tripId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.toggleFavorite(tripId);
      setTrips(trips.map((t) => t.id === tripId ? { ...t, is_favorite: !t.is_favorite } : t));
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  const handleDuplicate = async (tripId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.duplicateTrip(tripId);
      await fetchTrips();
    } catch (err) {
      console.error('Failed to duplicate trip', err);
    }
  };

  const handleDelete = async (tripId: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await api.deleteTrip(tripId);
        setTrips(trips.filter((t) => t.id !== tripId));
      } catch (err) {
        console.error('Failed to delete trip', err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Trip Portfolio</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Bookings & Saved Itineraries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your planned adventures, duplicates, and favorite destinations.</p>
        </div>
        <Link to="/plan-trip">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by trip or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Trips' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'favorites', label: 'Favorites' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-gray-400 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="newest">Recently Created</option>
            <option value="startDate">Travel Date</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm">
          <EmptyState
            title="No Itineraries Found"
            description="You don't have any trips matching this filter. Launch our Smart Trip Builder to create your first journey in seconds."
            actionText="Plan Your First Trip"
            onAction={() => window.location.href = '/plan-trip'}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((t) => (
            <Link
              key={t.id}
              to={`/itinerary/${t.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-600">
                    <MapPin className="w-3.5 h-3.5" />
                    {t.destination_city}, {t.destination_country}
                  </span>

                  <button
                    type="button"
                    title={t.is_favorite ? 'Remove Favorite' : 'Save Favorite'}
                    onClick={(e) => handleToggleFavorite(t.id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${t.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {t.start_date}
                    </span>
                    <span>•</span>
                    <span>{t.duration_days} Days</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {t.traveler_count}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">Est. Spending</span>
                    <span className="font-extrabold text-gray-900 text-sm">
                      {t.currency} {t.total_estimated_cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block font-medium">Activities</span>
                    <span className="font-bold text-gray-700">{t.activity_count} spots</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Schedule <ArrowRight className="w-3.5 h-3.5" />
                </span>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    title="Duplicate Trip"
                    onClick={(e) => handleDuplicate(t.id, e)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Delete Trip"
                    onClick={(e) => handleDelete(t.id, t.title, e)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};
