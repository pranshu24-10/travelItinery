import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { POPULAR_DESTINATIONS, FEATURED_PACKAGES } from '../data/mockData';
import { Button } from '../components/common/Button';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Compass, 
  ShieldCheck, 
  Coins, 
  HeartHandshake, 
  ArrowRight, 
  Star, 
  Clock, 
  CheckCircle,
  Search
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Heritage', 'Beaches', 'Mountains', 'Nature', 'Urban', 'Spiritual'];

  const filteredDestinations = selectedCategory === 'All'
    ? POPULAR_DESTINATIONS
    : POPULAR_DESTINATIONS.filter((d) => d.category === selectedCategory);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/destinations');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center rounded-3xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-4 border border-gray-100 shadow-xl">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/60 to-gray-950/40" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white py-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-rose-200 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Driven Personalized Travel Planner</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Your Next Adventure, <br />
            <span className="yesteryear-text font-normal text-5xl sm:text-7xl bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 bg-clip-text text-transparent">
              Planned by AI
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-gray-200 max-w-2xl mx-auto font-normal leading-relaxed">
            Generate custom, day-by-day travel itineraries with attractions, dining, route pacing, and realistic budget forecasts in seconds.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-gray-100">
              <div className="pl-3 text-gray-400">
                <MapPin className="w-5 h-5 text-brand-500" />
              </div>
              <input
                type="text"
                placeholder="Where to? (e.g. Kyoto, Jaipur, Paris, Goa)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
              <Button type="submit" variant="primary" size="md">
                Search
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 max-w-2xl mx-auto">
            <div>
              <span className="text-2xl font-bold text-white block">50+</span>
              <span className="text-xs text-gray-300">Curated Cities</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white block">10,000+</span>
              <span className="text-xs text-gray-300">Happy Travelers</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white block">4.9 / 5</span>
              <span className="text-xs text-gray-300">Satisfaction Score</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white block">100% Free</span>
              <span className="text-xs text-gray-300">AI Trip Planner</span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Explore The World</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Popular Destinations</h2>
            <p className="text-sm text-gray-500 mt-1">Handcrafted journeys through iconic cities and serene retreats.</p>
          </div>
          <Link to="/destinations">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Destinations
            </Button>
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.slice(0, 4).map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image_url}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm">
                  {dest.category}
                </div>
                <div className="absolute top-3 right-3 bg-gray-950/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300" />
                  {dest.rating}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    <span>{dest.state ? `${dest.state}, ` : ''}{dest.country}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{dest.name}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Est. Daily</span>
                    <span className="text-sm font-extrabold text-gray-900">${dest.estimated_daily_cost} / day</span>
                  </div>
                  <Link to={`/plan-trip?city=${dest.name}&country=${dest.country}`}>
                    <Button size="sm" variant="primary">
                      Plan Trip
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PACKAGES SECTION */}
      <section className="bg-gradient-to-b from-brand-50/50 to-transparent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Curated Tour Packages</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Ready-to-Travel Packages</h2>
            <p className="text-sm text-gray-500 mt-2">
              Browse pre-designed travel packages with transparent pricing, hotel categories, and custom AI personalization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={pkg.image_url}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    {pkg.tier}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-brand-600 block">{pkg.duration_text}</span>
                    <h3 className="text-base font-bold text-gray-900 mt-1 leading-tight">{pkg.name}</h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{pkg.description}</p>
                    
                    <ul className="mt-3 space-y-1">
                      {pkg.inclusions.slice(0, 2).map((inc, i) => (
                        <li key={i} className="text-[11px] text-gray-600 flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">From</span>
                      <span className="text-base font-extrabold text-gray-900">{pkg.price_text}</span>
                    </div>
                    <Link to={`/plan-trip?city=${pkg.destination.split(',')[0]}`}>
                      <Button size="sm" variant="primary">
                        Customize
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE TRAVELEASE FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Intelligent Architecture</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Why Plan With TravelEase?</h2>
          <p className="text-sm text-gray-500 mt-2">
            No more hours wasted juggling open tabs, blogs, and currency converters. Our AI plans every detail logically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 mb-5">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Schedule Pacing</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Geographically clustered activities to avoid unnecessary transit, including balanced morning, afternoon, and twilight intervals.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5">
              <Coins className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Transparent Cost Estimates</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Every sight and meal includes estimated costs based on your selected budget tier. Visual charts flag any overspending instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Full Customization & Sharing</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Regenerate individual days with fresh prompts, drag activities, add custom spots, export PDF, and share private read-only links.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS 3-STEP */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-white">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Simple 3-Step Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">How TravelEase Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-extrabold text-amber-300 mx-auto mb-4">
                1
              </div>
              <h4 className="text-base font-bold mb-1">Set Your Preferences</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Choose destination, dates, budget tier, travelers count, interests, and travel pace in our Smart Builder.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-extrabold text-brand-300 mx-auto mb-4">
                2
              </div>
              <h4 className="text-base font-bold mb-1">AI Crafts Your Itinerary</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our model assembles morning, afternoon, and evening sights, restaurants, transit directions, and interactive maps.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-extrabold text-emerald-300 mx-auto mb-4">
                3
              </div>
              <h4 className="text-base font-bold mb-1">Customize, Export & Travel</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Fine-tune activities, regenerate single days, check budget charts, and export PDF or share a private link with friends.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link to="/plan-trip">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Planning Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Traveler Feedback</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Loved by Explorers Worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "The day-by-day pacing in Kyoto was spot on. It kept our group from getting exhausted and the budget estimates matched real prices almost exactly!",
              author: "Sarah Jenkins",
              trip: "5-Day Kyoto Zen Journey",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
            },
            {
              quote: "The ability to regenerate just Day 2 when we wanted more relaxed food spots was unbelievable. And sharing the read-only link with my family made coordination effortless.",
              author: "Devendra Patel",
              trip: "4-Day Rajasthan Tour",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
            },
            {
              quote: "Cleanest travel interface I've used. No overwhelming clutter, just actionable itineraries, coordinates on a Leaflet map, and exact cost breakdowns.",
              author: "Elena Rostova",
              trip: "Paris Weekend Getaway",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            }
          ].map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{t.author}</h4>
                  <p className="text-[11px] text-gray-400">{t.trip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
