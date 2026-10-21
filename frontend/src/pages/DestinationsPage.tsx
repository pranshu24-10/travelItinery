import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { POPULAR_DESTINATIONS } from '../data/mockData';
import { Button } from '../components/common/Button';
import { MapPin, Star, Search, Sparkles, Filter } from 'lucide-react';

export const DestinationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'cost_asc' | 'cost_desc'>('rating');

  const categories = ['All', 'Heritage', 'Beaches', 'Mountains', 'Nature', 'Urban', 'Spiritual'];

  const filtered = POPULAR_DESTINATIONS.filter((dest) => {
    const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
    const matchesSearch = !search.trim() || 
      dest.name.toLowerCase().includes(search.toLowerCase()) || 
      dest.country.toLowerCase().includes(search.toLowerCase()) ||
      (dest.state && dest.state.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'cost_asc') return a.estimated_daily_cost - b.estimated_daily_cost;
    return b.estimated_daily_cost - a.estimated_daily_cost;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Destination Directory</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">Explore Popular Destinations</h1>
        <p className="text-sm text-gray-500 mt-2">
          Discover incredible cities, coastal havens, and mountain valleys. Click any destination to generate a customized AI itinerary.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by city, state, or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="rating">Top Rated</option>
            <option value="cost_asc">Cost: Low to High</option>
            <option value="cost_desc">Cost: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sorted.map((dest) => (
          <div
            key={dest.id}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
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
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {dest.rating}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  <span>{dest.state ? `${dest.state}, ` : ''}{dest.country}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{dest.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {dest.tagline}
                </p>

                {/* Highlights */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Signature Spots
                  </span>
                  <div className="space-y-1">
                    {dest.highlights.slice(0, 2).map((hl, i) => (
                      <div key={i} className="text-[11px] text-gray-600 truncate flex items-center gap-1">
                        <span className="text-brand-500 font-bold">•</span>
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Est. Daily</span>
                  <span className="text-sm font-extrabold text-gray-900">${dest.estimated_daily_cost} / day</span>
                </div>
                <Link to={`/plan-trip?city=${dest.name}&country=${dest.country}`}>
                  <Button size="sm" variant="primary" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                    Plan Trip
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
