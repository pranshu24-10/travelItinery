import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Heart, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Compass,
  Zap,
  Info
} from 'lucide-react';

const INTERESTS_OPTIONS = [
  { id: 'Culture & History', label: 'Culture & History', icon: '🏛️' },
  { id: 'Food & Dining', label: 'Food & Dining', icon: '🍲' },
  { id: 'Nature', label: 'Nature & Parks', icon: '🌿' },
  { id: 'Adventure', label: 'Adventure Sports', icon: '🧗' },
  { id: 'Beaches', label: 'Beaches & Coastline', icon: '🏖️' },
  { id: 'Shopping', label: 'Shopping & Bazaars', icon: '🛍️' },
  { id: 'Nightlife', label: 'Nightlife & Lounges', icon: '🍸' },
  { id: 'Photography', label: 'Photography Spots', icon: '📸' },
  { id: 'Relaxation', label: 'Wellness & Relaxation', icon: '🧘' },
  { id: 'Spiritual', label: 'Spiritual & Sacred', icon: '🪔' },
  { id: 'Hidden Gems', label: 'Hidden Gems', icon: '💎' }
];

const POPULAR_DESTINATIONS = [
  { city: 'Jaipur', country: 'India' },
  { city: 'Goa', country: 'India' },
  { city: 'Kyoto', country: 'Japan' },
  { city: 'Paris', country: 'France' },
  { city: 'Manali', country: 'India' },
  { city: 'Bali', country: 'Indonesia' },
  { city: 'Rome', country: 'Italy' },
  { city: 'New York', country: 'USA' },
];

export const TripBuilderWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [destinationCity, setDestinationCity] = useState(searchParams.get('city') || 'Jaipur');
  const [destinationCountry, setDestinationCountry] = useState(searchParams.get('country') || 'India');
  
  // Date calculation defaults: 3 days starting tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 4);

  const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(threeDaysLater.toISOString().split('T')[0]);

  const [travelerType, setTravelerType] = useState<'solo' | 'couple' | 'family' | 'group'>('couple');
  const [travelerCount, setTravelerCount] = useState(2);

  const [totalBudget, setTotalBudget] = useState(1200);
  const [currency, setCurrency] = useState('USD');
  const [budgetTier, setBudgetTier] = useState<'budget' | 'moderate' | 'premium' | 'luxury'>('moderate');

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Culture & History',
    'Food & Dining',
    'Sightseeing'
  ]);

  const [travelStyle, setTravelStyle] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');
  const [accommodationType, setAccommodationType] = useState('Boutique Hotel');
  const [transportMode, setTransportMode] = useState('Mixed (Metro & Taxis)');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [accessibilityNotes, setAccessibilityNotes] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Calculate Duration
  const calculateDuration = () => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    } catch {
      return 3;
    }
  };

  const durationDays = calculateDuration();
  const dailyBudget = Math.round(totalBudget / (durationDays * Math.max(1, travelerCount)));

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const validateStep = (step: number) => {
    setErrorMsg('');
    if (step === 1) {
      if (!destinationCity.trim()) {
        setErrorMsg('Please enter a destination city');
        return false;
      }
    }
    if (step === 2) {
      if (!startDate || !endDate) {
        setErrorMsg('Please specify both start and end dates');
        return false;
      }
      if (new Date(endDate) < new Date(startDate)) {
        setErrorMsg('End date cannot precede start date');
        return false;
      }
    }
    if (step === 4) {
      if (totalBudget <= 0) {
        setErrorMsg('Please specify a positive budget');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg('');

    const payload = {
      title: `${durationDays}-Day Escape to ${destinationCity}`,
      destination_city: destinationCity,
      destination_country: destinationCountry || 'Global',
      start_date: startDate,
      end_date: endDate,
      duration_days: durationDays,
      traveler_type: travelerType,
      traveler_count: travelerCount,
      total_budget: totalBudget,
      currency: currency,
      budget_tier: budgetTier,
      interests: selectedInterests,
      travel_style: travelStyle,
      accommodation_type: accommodationType,
      transport_mode: transportMode,
      dietary_preferences: dietaryPreferences || undefined,
      accessibility_notes: accessibilityNotes || undefined,
      additional_notes: additionalNotes || undefined,
      auto_generate: true
    };

    try {
      const newTrip = await api.createTrip(payload);
      navigate(`/itinerary/${newTrip.id}`);
    } catch (err: any) {
      console.error('Trip creation failed:', err);
      setErrorMsg(err.message || 'Failed to generate itinerary. Please try again.');
      setIsGenerating(false);
    }
  };

  const steps = [
    { num: 1, label: 'Destination', icon: <MapPin className="w-3.5 h-3.5" /> },
    { num: 2, label: 'Dates', icon: <Calendar className="w-3.5 h-3.5" /> },
    { num: 3, label: 'Travelers', icon: <Users className="w-3.5 h-3.5" /> },
    { num: 4, label: 'Budget', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { num: 5, label: 'Interests', icon: <Heart className="w-3.5 h-3.5" /> },
    { num: 6, label: 'Style & Pace', icon: <Sliders className="w-3.5 h-3.5" /> },
    { num: 7, label: 'Review & Plan', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar & Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 overflow-x-auto pb-2 scrollbar-none">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num);
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                    : isCompleted
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-gray-400 bg-gray-100'
                }`}
              >
                <span>{s.num}.</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl shadow-gray-100/60 relative">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: DESTINATION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Step 1 of 7</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Where are you venturing next?</h2>
              <p className="text-sm text-gray-500 mt-1">Enter your dream destination city or choose from popular picks.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Destination City *"
                placeholder="e.g. Kyoto, Jaipur, Paris, Bali"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
                required
              />
              <Input
                label="Country / Region"
                placeholder="e.g. Japan, India, France"
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Popular Quick Picks
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    type="button"
                    key={dest.city}
                    onClick={() => {
                      setDestinationCity(dest.city);
                      setDestinationCountry(dest.country);
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                      destinationCity === dest.city
                        ? 'bg-brand-50 border-brand-500 text-brand-600 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-brand-300 hover:bg-gray-50'
                    }`}
                  >
                    📍 {dest.city}, {dest.country}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DATES */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Step 2 of 7</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">When are you traveling?</h2>
              <p className="text-sm text-gray-500 mt-1">Select your dates to auto-calculate your trip duration.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                leftIcon={<Calendar className="w-4 h-4" />}
                required
              />
              <Input
                label="End Date *"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                leftIcon={<Calendar className="w-4 h-4" />}
                required
              />
            </div>

            <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Calculated Trip Length</span>
                <p className="text-lg font-extrabold text-gray-900">{durationDays} Days / {Math.max(1, durationDays - 1)} Nights</p>
              </div>
              <Compass className="w-8 h-8 text-brand-500 animate-pulse" />
            </div>
          </div>
        )}

        {/* STEP 3: TRAVELERS */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Step 3 of 7</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Who is accompanying you?</h2>
              <p className="text-sm text-gray-500 mt-1">We tailor daily schedules and room configurations to your group.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { type: 'solo', label: 'Solo Traveler', count: 1, icon: '🎒' },
                { type: 'couple', label: 'Couple / Duo', count: 2, icon: '👫' },
                { type: 'family', label: 'Family', count: 4, icon: '👨‍👩‍👧‍👦' },
                { type: 'group', label: 'Friends Group', count: 5, icon: '🎉' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.type}
                  onClick={() => {
                    setTravelerType(t.type as any);
                    setTravelerCount(t.count);
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    travelerType === t.type
                      ? 'border-brand-500 bg-brand-50/70 shadow-sm'
                      : 'border-gray-200 hover:border-brand-200'
                  }`}
                >
                  <span className="text-2xl block mb-1">{t.icon}</span>
                  <span className="text-xs font-bold text-gray-800 block">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Total Travelers Count
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xl font-extrabold text-gray-900 w-12 text-center">{travelerCount}</span>
                <button
                  type="button"
                  onClick={() => setTravelerCount(travelerCount + 1)}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BUDGET */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Step 4 of 7</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">What is your target budget?</h2>
              <p className="text-sm text-gray-500 mt-1">We align estimated activity costs and lodging to this ceiling.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Total Trip Budget *"
                type="number"
                min="50"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                leftIcon={<DollarSign className="w-4 h-4" />}
                required
              />
              <Select
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={[
                  { value: 'USD', label: 'USD ($) — US Dollar' },
                  { value: 'EUR', label: 'EUR (€) — Euro' },
                  { value: 'GBP', label: 'GBP (£) — British Pound' },
                  { value: 'INR', label: 'INR (₹) — Indian Rupee' },
                  { value: 'JPY', label: 'JPY (¥) — Japanese Yen' },
                  { value: 'CAD', label: 'CAD ($) — Canadian Dollar' },
                  { value: 'AUD', label: 'AUD ($) — Australian Dollar' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Budget Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { tier: 'budget', label: 'Budget', desc: 'Hostels & Street Eats' },
                  { tier: 'moderate', label: 'Moderate', desc: 'Comfort & 3-Star' },
                  { tier: 'premium', label: 'Premium', desc: 'Boutique & Fine Dining' },
                  { tier: 'luxury', label: 'Luxury', desc: '5-Star & Private Guides' },
                ].map((b) => (
                  <button
                    type="button"
                    key={b.tier}
                    onClick={() => setBudgetTier(b.tier as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      budgetTier === b.tier
                        ? 'border-brand-500 bg-brand-50/70 shadow-sm'
                        : 'border-gray-200 hover:border-brand-200'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-900 block capitalize">{b.label}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{b.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Estimated Daily Budget per Person</span>
                <p className="text-lg font-extrabold text-emerald-950">~ {currency} {dailyBudget} / day</p>
              </div>
              <Info className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        )}

        {/* STEP 5: INTERESTS */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Step 5 of 7</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Select your interests</h2>
              <p className="text-sm text-gray-500 mt-1">Pick multiple tags so AI matches your favorite travel activities.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {INTERESTS_OPTIONS.map((item) => {
                const selected = selectedInterests.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                      selected
                        ? 'border-brand-500 bg-brand-50/80 text-brand-700 shadow-sm font-semibold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: TRAVEL STYLE */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Step 6 of 7</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Travel style & preferences</h2>
              <p className="text-sm text-gray-500 mt-1">Specify pace, transportation mode, and dietary requirements.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Pacing
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { style: 'relaxed', label: 'Relaxed', desc: '2-3 leisurely spots' },
                  { style: 'balanced', label: 'Balanced', desc: '3-4 spots + meal stops' },
                  { style: 'packed', label: 'Action-Packed', desc: '5+ sights, maximum coverage' },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.style}
                    onClick={() => setTravelStyle(s.style as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      travelStyle === s.style
                        ? 'border-brand-500 bg-brand-50/70 shadow-sm'
                        : 'border-gray-200 hover:border-brand-200'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-900 block capitalize">{s.label}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Preferred Lodging Type"
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value)}
                options={[
                  { value: 'Boutique Hotel', label: 'Boutique Hotel' },
                  { value: 'Heritage Haveli / Traditional Villa', label: 'Heritage / Villa' },
                  { value: 'Beachfront Resort', label: 'Beachfront Resort' },
                  { value: 'Vacation Apartment / Airbnb', label: 'Rental Apartment' },
                  { value: 'Hostel / Budget Inn', label: 'Hostel / Budget Inn' },
                  { value: 'Luxury 5-Star Hotel', label: 'Luxury 5-Star Hotel' },
                ]}
              />
              <Select
                label="Primary Transport Mode"
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                options={[
                  { value: 'Mixed (Metro & Taxis)', label: 'Mixed (Metro & Taxis)' },
                  { value: 'Public Transit & Walking', label: 'Public Transit & Walking' },
                  { value: 'Private Chauffeur / Cabs', label: 'Private Cabs' },
                  { value: 'Rental Scooter / Car', label: 'Rental Scooter / Car' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Dietary Preferences (Optional)"
                placeholder="e.g. Vegetarian, Vegan, Halal, Gluten-free"
                value={dietaryPreferences}
                onChange={(e) => setDietaryPreferences(e.target.value)}
              />
              <Input
                label="Accessibility (Optional)"
                placeholder="e.g. Wheelchair accessible, minimal stairs"
                value={accessibilityNotes}
                onChange={(e) => setAccessibilityNotes(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Looking for best sunset rooftop cafes and authentic handicraft markets."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Step 7 of 7</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Review your journey summary</h2>
              <p className="text-sm text-gray-500 mt-1">Verify your parameters before launching our AI itinerary engine.</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-500" />
                  <span className="font-bold text-gray-900 text-base">{destinationCity}, {destinationCountry}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">Duration</span>
                  <span className="font-bold text-gray-800 text-sm">{durationDays} Days ({startDate} - {endDate})</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Travelers</span>
                  <span className="font-bold text-gray-800 text-sm">{travelerCount} ({travelerType})</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Target Budget</span>
                  <span className="font-bold text-gray-800 text-sm">{currency} {totalBudget} ({budgetTier})</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Pace</span>
                  <span className="font-bold text-gray-800 text-sm capitalize">{travelStyle}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Transport</span>
                  <span className="font-bold text-gray-800 text-sm">{transportMode}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Lodging</span>
                  <span className="font-bold text-gray-800 text-sm">{accommodationType}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-gray-400 block text-xs font-medium mb-1.5">Selected Interests</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInterests.map((interest) => (
                    <span key={interest} className="text-[11px] font-semibold bg-white px-2.5 py-1 rounded-full border border-gray-200 text-gray-700">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {dietaryPreferences && (
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-700">Dietary:</span> {dietaryPreferences}
                </div>
              )}
            </div>

            <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 flex items-center gap-3 text-xs text-brand-800">
              <Sparkles className="w-5 h-5 text-brand-600 shrink-0" />
              <span>
                Our AI model analyzes local geography, opening hours, transit corridors, and your budget to build a cohesive day-by-day itinerary.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-100 mt-8">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isGenerating}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : <div />}

          {currentStep < 7 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isGenerating}
              onClick={handleGenerate}
              leftIcon={<Sparkles className="w-5 h-5 text-amber-300" />}
            >
              {isGenerating ? 'Generating Your Itinerary...' : 'Generate AI Itinerary'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
