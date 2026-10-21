import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Trip, ItineraryDay, Activity, BudgetAnalytics } from '../types';
import { ActivityCard } from '../components/itinerary/ActivityCard';
import { ActivityModal } from '../components/itinerary/ActivityModal';
import { TripMap } from '../components/map/TripMap';
import { BudgetOverview } from '../components/analytics/BudgetOverview';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Share2, 
  Printer, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  Edit2, 
  Check, 
  ChevronRight, 
  Copy, 
  CheckCheck, 
  Building, 
  Lightbulb, 
  PieChart as ChartIcon, 
  Map as MapIcon, 
  ListOrdered,
  AlertCircle
} from 'lucide-react';

export const ItineraryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [analytics, setAnalytics] = useState<BudgetAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Active view: 'all' or day number (1, 2, ...) or 'overview'
  const [activeTab, setActiveTab] = useState<string>('1');
  const [showMap, setShowMap] = useState<boolean>(true);
  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false);

  // Editable Title State
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  // Modals
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [targetDayId, setTargetDayId] = useState<string>('');

  // Regenerate Day Modal
  const [regenDayModalOpen, setRegenDayModalOpen] = useState(false);
  const [regenDayNumber, setRegenDayNumber] = useState<number>(1);
  const [regenGuidance, setRegenGuidance] = useState<string>('');
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);

  // Regenerate Entire Trip
  const [isRegeneratingTrip, setIsRegeneratingTrip] = useState(false);

  // Share Modal
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  const fetchTripData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const tripData = await api.getTrip(id);
      setTrip(tripData);
      setTitleInput(tripData.title);
      setIsShared(tripData.is_shared);
      setShareToken(tripData.share_token || null);

      // Fetch budget analytics
      const budgetData = await api.getTripBudget(id);
      setAnalytics(budgetData);
    } catch (err: any) {
      setError(err.message || 'Failed to load itinerary details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripData();
  }, [id]);

  const handleSaveTitle = async () => {
    if (!trip || !titleInput.trim()) return;
    try {
      const updated = await api.updateTrip(trip.id, { title: titleInput });
      setTrip(updated);
      setIsEditingTitle(false);
    } catch (err) {
      console.error('Failed to update title', err);
    }
  };

  const handleSaveActivity = async (data: any) => {
    if (!trip) return;
    if (editingActivity) {
      await api.updateActivity(editingActivity.id, data);
    } else {
      await api.addActivity(trip.id, data);
    }
    await fetchTripData();
  };

  const handleDeleteActivity = async (actId: string) => {
    try {
      await api.deleteActivity(actId);
      await fetchTripData();
    } catch (err) {
      console.error('Failed to delete activity', err);
    }
  };

  const handleMoveActivity = async (day: ItineraryDay, actId: string, direction: 'up' | 'down') => {
    if (!trip) return;
    const activities = [...day.activities];
    const index = activities.findIndex((a) => a.id === actId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === activities.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = activities[index];
    activities[index] = activities[swapIndex];
    activities[swapIndex] = temp;

    // Update locally for instant responsiveness
    day.activities = activities;
    setTrip({ ...trip });

    // Send reorder payload to backend
    const reorderPayload = {
      day_id: day.id,
      activities: activities.map((a, i) => ({ activity_id: a.id, order_index: i }))
    };

    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/v1/trips/${trip.id}/reorder-activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('travelease_token')}`
        },
        body: JSON.stringify(reorderPayload)
      });
    } catch (err) {
      console.error('Reorder sync failed', err);
    }
  };

  const handleRegenerateDay = async () => {
    if (!trip) return;
    setIsRegeneratingDay(true);
    try {
      const updated = await api.regenerateDay(trip.id, regenDayNumber, regenGuidance);
      setTrip(updated);
      const budgetData = await api.getTripBudget(trip.id);
      setAnalytics(budgetData);
      setRegenDayModalOpen(false);
      setRegenGuidance('');
    } catch (err) {
      console.error('Failed to regenerate day', err);
    } finally {
      setIsRegeneratingDay(false);
    }
  };

  const handleRegenerateEntireTrip = async () => {
    if (!trip) return;
    if (!window.confirm('Regenerate entire itinerary? Custom edits will be replaced with fresh AI recommendations.')) {
      return;
    }
    setIsRegeneratingTrip(true);
    try {
      const updated = await api.regenerateEntireTrip(trip.id);
      setTrip(updated);
      const budgetData = await api.getTripBudget(trip.id);
      setAnalytics(budgetData);
    } catch (err) {
      console.error('Failed to regenerate trip', err);
    } finally {
      setIsRegeneratingTrip(false);
    }
  };

  const handleToggleSharing = async () => {
    if (!trip) return;
    setShareLoading(true);
    try {
      if (isShared) {
        await api.disableSharing(trip.id);
        setIsShared(false);
        setShareToken(null);
      } else {
        const res = await api.enableSharing(trip.id);
        setIsShared(true);
        setShareToken(res.share_token);
      }
    } catch (err) {
      console.error('Failed to toggle sharing', err);
    } finally {
      setShareLoading(false);
    }
  };

  const copyShareLink = () => {
    if (!shareToken) return;
    const shareUrl = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

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
        <h2 className="text-xl font-bold text-gray-900 mb-2">Itinerary Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'This itinerary does not exist or you do not have permission to view it.'}</p>
        <Link to="/booking">
          <Button variant="primary">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  // Determine which activities to show
  const currentDay = activeTab !== 'all' && activeTab !== 'overview'
    ? trip.days.find((d: ItineraryDay) => d.day_number === parseInt(activeTab))
    : null;

  const visibleActivities = activeTab === 'all'
    ? trip.days.flatMap((d: ItineraryDay) => d.activities)
    : currentDay
    ? currentDay.activities
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          
          {/* Title & Metadata */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-600 border border-brand-100">
                <MapPin className="w-3.5 h-3.5" />
                {trip.destination_city}, {trip.destination_country}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                {trip.travel_style} Pace
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 capitalize">
                {trip.budget_tier} Tier
              </span>
              {trip.is_shared && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                  <Share2 className="w-3 h-3" /> Shared
                </span>
              )}
            </div>

            {/* Editable Title */}
            {isEditingTitle ? (
              <div className="flex items-center gap-2 max-w-xl">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="text-2xl sm:text-3xl font-extrabold text-gray-900 border-b-2 border-brand-500 pb-1 focus:outline-none w-full"
                />
                <Button size="sm" variant="primary" onClick={handleSaveTitle} leftIcon={<Check className="w-4 h-4" />}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 group">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                  {trip.title}
                </h1>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-brand-500 rounded-lg hover:bg-gray-100 transition-all no-print"
                  title="Rename Trip"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Trip Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-500 font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                {trip.start_date} to {trip.end_date} ({trip.duration_days} Days)
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                {trip.traveler_count} Traveler{trip.traveler_count > 1 ? 's' : ''} ({trip.traveler_type})
              </span>
              <span className="flex items-center gap-1.5 font-bold text-gray-800">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Budget: {trip.currency} {trip.total_budget.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowBudgetModal(true)}
              leftIcon={<ChartIcon className="w-4 h-4 text-brand-500" />}
            >
              Budget Analytics
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShareModalOpen(true)}
              leftIcon={<Share2 className="w-4 h-4 text-blue-500" />}
            >
              Share Trip
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-4 h-4 text-gray-600" />}
            >
              Print / PDF
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleRegenerateEntireTrip}
              isLoading={isRegeneratingTrip}
              leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
            >
              Regenerate All
            </Button>
          </div>
        </div>

        {/* Daily Tabs & View Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          
          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
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
            {trip.days.map((d: ItineraryDay) => (
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

          {/* Map & Add Action */}
          <div className="flex items-center gap-2 no-print self-end sm:self-auto">
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                showMap ? 'border-brand-500 text-brand-600 bg-brand-50/50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
            </button>
            {currentDay && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRegenDayNumber(currentDay.day_number);
                    setRegenDayModalOpen(true);
                  }}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Regenerate Day
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setEditingActivity(null);
                    setTargetDayId(currentDay.id);
                    setActivityModalOpen(true);
                  }}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Spot
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* OVERVIEW TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Trip Narrative */}
          {trip.trip_overview && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-brand-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider text-xs">Curated Trip Narrative</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-normal whitespace-pre-line">
                {trip.trip_overview}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommended Lodging Areas */}
            {trip.accommodation_recommendations && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Building className="w-5 h-5" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Recommended Neighborhoods</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {trip.accommodation_recommendations}
                </p>
              </div>
            )}

            {/* Local Tips & Etiquette */}
            {trip.local_tips && trip.local_tips.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-600">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Local Tips & Etiquette</h3>
                </div>
                <ul className="space-y-2">
                  {trip.local_tips.map((tip: string, idx: number) => (
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

      {/* DAILY / ALL DAYS ACTIVITY SCHEDULE */}
      {activeTab !== 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Timeline & Activities (7 or 12 cols depending on map toggle) */}
          <div className={`${showMap ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-8`}>
            
            {activeTab === 'all' ? (
              // ALL DAYS VIEW
              trip.days.map((day: ItineraryDay) => (
                <div key={day.id} className="space-y-4 print-page-break">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Day {day.day_number}</span>
                      <h3 className="text-xl font-bold text-gray-900">{day.theme_title || `Day ${day.day_number}`}</h3>
                      {day.daily_notes && (
                        <p className="text-xs text-gray-500 mt-0.5">{day.daily_notes}</p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-gray-400">
                      {day.activities.length} activities
                    </span>
                  </div>

                  <div className="space-y-3">
                    {day.activities.map((act: Activity, idx: number) => (
                      <ActivityCard
                        key={act.id}
                        activity={act}
                        isFirst={idx === 0}
                        isLast={idx === day.activities.length - 1}
                        onEdit={(a: Activity) => {
                          setEditingActivity(a);
                          setTargetDayId(day.id);
                          setActivityModalOpen(true);
                        }}
                        onDelete={handleDeleteActivity}
                        onMoveUp={(actId: string) => handleMoveActivity(day, actId, 'up')}
                        onMoveDown={(actId: string) => handleMoveActivity(day, actId, 'down')}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : currentDay ? (
              // SINGLE DAY VIEW
              <div className="space-y-4">
                <div className="bg-brand-50/50 rounded-2xl p-5 border border-brand-100">
                  <div className="flex items-center justify-between">
                    <div>
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
                  </div>
                </div>

                {currentDay.activities.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <p className="text-sm font-semibold text-gray-600">No activities scheduled yet for this day.</p>
                    <p className="text-xs text-gray-400 mt-1 mb-4">Add your own attraction or let AI regenerate this day.</p>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setEditingActivity(null);
                        setTargetDayId(currentDay.id);
                        setActivityModalOpen(true);
                      }}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Add First Spot
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentDay.activities.map((act: Activity, idx: number) => (
                      <ActivityCard
                        key={act.id}
                        activity={act}
                        isFirst={idx === 0}
                        isLast={idx === currentDay.activities.length - 1}
                        onEdit={(a: Activity) => {
                          setEditingActivity(a);
                          setTargetDayId(currentDay.id);
                          setActivityModalOpen(true);
                        }}
                        onDelete={handleDeleteActivity}
                        onMoveUp={(actId: string) => handleMoveActivity(currentDay, actId, 'up')}
                        onMoveDown={(actId: string) => handleMoveActivity(currentDay, actId, 'down')}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Estimation Notice */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-[11px] text-gray-500 leading-relaxed text-center">
              ⚠️ <strong>Traveler Notice:</strong> Sights, durations, and estimated costs are calculated approximations. Real-world opening hours, ticket availability, and seasonal tariffs should be checked independently.
            </div>
          </div>

          {/* Right Column: Interactive Map (5 cols) */}
          {showMap && (
            <div className="lg:col-span-5 space-y-4 no-print">
              <div className="sticky top-28 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <MapIcon className="w-4 h-4 text-brand-500" />
                    Interactive Attraction Map
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {visibleActivities.filter((a: Activity) => a.latitude && a.longitude).length} mapped pins
                  </span>
                </div>

                <TripMap
                  activities={visibleActivities}
                  destinationName={trip.destination_city}
                  className="h-[460px] w-full rounded-2xl overflow-hidden border border-gray-100"
                />

                <p className="text-[11px] text-gray-400 text-center">
                  Dashed lines show sequential walking or transit corridors between activities.
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ACTIVITY ADD/EDIT MODAL */}
      <ActivityModal
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        onSave={handleSaveActivity}
        activity={editingActivity}
        dayId={targetDayId}
        tripId={trip.id}
        currency={trip.currency}
      />

      {/* REGENERATE DAY MODAL */}
      <Modal
        isOpen={regenDayModalOpen}
        onClose={() => setRegenDayModalOpen(false)}
        title={`Regenerate Day ${regenDayNumber}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Provide guidance to customize this day (e.g. "Focus on local artisan coffee shops and peaceful temples" or "More adventure and nature trails").
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Custom Day Guidance
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Swap crowded museum visits for quiet scenic viewpoints and vegetarian food..."
              value={regenGuidance}
              onChange={(e) => setRegenGuidance(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button variant="outline" onClick={() => setRegenDayModalOpen(false)} disabled={isRegeneratingDay}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRegenerateDay} isLoading={isRegeneratingDay}>
              Regenerate Day
            </Button>
          </div>
        </div>
      </Modal>

      {/* BUDGET ANALYTICS MODAL */}
      <Modal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        title="Trip Budget Analytics & Forecast"
        maxWidth="2xl"
      >
        {analytics ? (
          <BudgetOverview analytics={analytics} />
        ) : (
          <LoadingSkeleton rows={3} />
        )}
      </Modal>

      {/* SHARE TRIP MODAL */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Itinerary with Friends & Family"
      >
        <div className="space-y-5">
          <p className="text-xs text-gray-600 leading-relaxed">
            Generate a secure, public read-only link. Anyone with this link can view the daily schedule, map, and recommendations without needing to sign in.
          </p>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div>
              <span className="text-xs font-bold text-gray-900 block">Public Sharing</span>
              <span className="text-[11px] text-gray-500">
                {isShared ? 'Public link is active and accessible' : 'Public sharing is currently disabled'}
              </span>
            </div>
            <button
              onClick={handleToggleSharing}
              disabled={shareLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isShared
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-brand-500 text-white shadow-sm hover:bg-brand-600'
              }`}
            >
              {shareLoading ? 'Updating...' : isShared ? 'Revoke Link' : 'Enable Sharing'}
            </button>
          </div>

          {isShared && shareToken && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Public Share Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/share/${shareToken}`}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 font-mono select-all focus:outline-none"
                />
                <Button
                  size="sm"
                  variant="primary"
                  onClick={copyShareLink}
                  leftIcon={copiedLink ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copiedLink ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};
