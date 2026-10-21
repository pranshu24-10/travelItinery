import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Trip, ItineraryDay } from '../types';
import { ActivityCard } from '../components/itinerary/ActivityCard';
import { TripMap } from '../components/map/TripMap';
import { Button } from '../components/common/Button';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles, 
  Building, 
  Lightbulb, 
  Share2, 
  Compass, 
  Printer,
  AlertCircle
} from 'lucide-react';

export const SharedTripPage: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<string>('1');

  useEffect(() => {
    const fetchShared = async () => {
      if (!shareToken) return;
      try {
        setLoading(true);
        const data = await api.getSharedTrip(shareToken);
        setTrip(data);
      } catch (err: any) {
        setError(err.message || 'Shared itinerary is unavailable or has expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Itinerary Unavailable</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'This shared link has expired or been revoked.'}</p>
        <Link to="/">
          <Button variant="primary">Explore TravelEase</Button>
        </Link>
      </div>
    );
  }

  const currentDay = activeTab !== 'all' && activeTab !== 'overview'
    ? trip.days.find((d) => d.day_number === parseInt(activeTab))
    : null;

  const visibleActivities = activeTab === 'all'
    ? trip.days.flatMap((d) => d.activities)
    : currentDay
    ? currentDay.activities
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner Notice */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-center justify-between text-brand-800">
        <div className="flex items-center gap-2.5">
          <Share2 className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-semibold">
            You are viewing a shared read-only travel itinerary created with TravelEase.
          </span>
        </div>
        <Link to="/plan-trip">
          <Button size="sm" variant="primary">
            Plan My Own Trip
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-600">
                <MapPin className="w-3.5 h-3.5" />
                {trip.destination_city}, {trip.destination_country}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                {trip.travel_style} Pace
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 capitalize">
                {trip.budget_tier} Tier
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {trip.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                {trip.start_date} to {trip.end_date} ({trip.duration_days} Days)
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                {trip.traveler_count} Traveler{trip.traveler_count > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-gray-800">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Target Budget: {trip.currency} {trip.total_budget}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-4 h-4 text-gray-600" />}
            >
              Print Itinerary
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Overview & Tips
          </button>
          {trip.days.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveTab(String(d.day_number))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === String(d.day_number)
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Day {d.day_number}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'all'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Days ({trip.days.length})
          </button>
        </div>
      </div>

      {/* OVERVIEW CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {trip.trip_overview && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-brand-600">
                Curated Narrative
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal whitespace-pre-line">
                {trip.trip_overview}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trip.accommodation_recommendations && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Building className="w-5 h-5" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Lodging Suggestions</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {trip.accommodation_recommendations}
                </p>
              </div>
            )}

            {trip.local_tips && trip.local_tips.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-600">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Local Tips & Etiquette</h3>
                </div>
                <ul className="space-y-2">
                  {trip.local_tips.map((tip, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCHEDULE & MAP */}
      {activeTab !== 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {activeTab === 'all' ? (
              trip.days.map((day) => (
                <div key={day.id} className="space-y-4 print-page-break">
                  <div className="pb-2 border-b border-gray-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Day {day.day_number}</span>
                    <h3 className="text-xl font-bold text-gray-900">{day.theme_title || `Day ${day.day_number}`}</h3>
                  </div>
                  <div className="space-y-3">
                    {day.activities.map((act, idx) => (
                      <ActivityCard
                        key={act.id}
                        activity={act}
                        isFirst={idx === 0}
                        isLast={idx === day.activities.length - 1}
                        readOnly={true}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : currentDay ? (
              <div className="space-y-4">
                <div className="bg-brand-50/50 rounded-2xl p-5 border border-brand-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Day {currentDay.day_number} Focus
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                    {currentDay.theme_title || `Day ${currentDay.day_number}`}
                  </h3>
                  {currentDay.daily_notes && (
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{currentDay.daily_notes}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {currentDay.activities.map((act, idx) => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      isFirst={idx === 0}
                      isLast={idx === currentDay.activities.length - 1}
                      readOnly={true}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Map Preview */}
          <div className="lg:col-span-5 space-y-4 no-print">
            <div className="sticky top-28 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <span className="text-xs font-bold text-gray-700 block">Attractions Map</span>
              <TripMap
                activities={visibleActivities}
                destinationName={trip.destination_city}
                className="h-[460px] w-full rounded-2xl overflow-hidden border border-gray-100"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
