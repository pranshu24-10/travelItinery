import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TripListItem } from '../types';
import { Button } from '../components/common/Button';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Plus, 
  TrendingUp, 
  Compass, 
  Heart, 
  ArrowRight,
  DollarSign
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await api.getTrips();
        setTrips(data);
      } catch (err) {
        console.error('Failed to load dashboard trips', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const totalBudgetSum = trips.reduce((acc, t) => acc + t.total_budget, 0);
  const favoritesCount = trips.filter((t) => t.is_favorite).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-tr from-brand-600 via-rose-500 to-pink-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-rose-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Welcome back, {user?.full_name || 'Traveler'}!</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Ready for your next adventure?
          </h1>
          <p className="text-sm text-rose-100 leading-relaxed font-normal">
            Your travel command center. Launch our Smart Trip Builder to design day-by-day itineraries with attractions, food, and budget predictions.
          </p>

          <div className="pt-2">
            <Link to="/plan-trip">
              <Button size="md" className="bg-white text-brand-600 hover:bg-gray-100 font-bold shadow-lg" leftIcon={<Plus className="w-4 h-4 text-brand-500" />}>
                Create New Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Compass watermark */}
        <Compass className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Total Trips</span>
          <span className="text-2xl font-extrabold text-gray-900">{trips.length}</span>
          <span className="text-[11px] text-gray-400 block mt-1">Planned journeys</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Favorite Trips</span>
          <span className="text-2xl font-extrabold text-brand-500">{favoritesCount}</span>
          <span className="text-[11px] text-gray-400 block mt-1">Bookmarked places</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Total Budget Target</span>
          <span className="text-2xl font-extrabold text-emerald-600">${totalBudgetSum.toLocaleString()}</span>
          <span className="text-[11px] text-gray-400 block mt-1">Combined expenditure</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Preferred Currency</span>
          <span className="text-2xl font-extrabold text-gray-900">{user?.preferred_currency || 'USD'}</span>
          <span className="text-[11px] text-gray-400 block mt-1">Default denomination</span>
        </div>
      </div>

      {/* Recent Trips Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Itineraries</h2>
            <p className="text-xs text-gray-500">Pick up where you left off or customize an existing schedule.</p>
          </div>
          <Link to="/booking" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
            View All ({trips.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton rows={2} />
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center space-y-3">
            <Compass className="w-10 h-10 text-brand-500 mx-auto" />
            <h3 className="text-base font-bold text-gray-900">No Trips Created Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Start by building an itinerary for your dream holiday. It takes less than 30 seconds!
            </p>
            <Link to="/plan-trip">
              <Button size="sm" variant="primary">
                Build Trip
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((t) => (
              <Link
                key={t.id}
                to={`/itinerary/${t.id}`}
                className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                      {t.destination_city}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">{t.duration_days} Days</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {t.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {t.start_date} • {t.traveler_count} Traveler{t.traveler_count > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-gray-900">
                    {t.currency} {t.total_estimated_cost.toFixed(2)}
                  </span>
                  <span className="text-brand-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
