import React from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PACKAGES } from '../data/mockData';
import { Button } from '../components/common/Button';
import { Star, CheckCircle, Clock, Sparkles, MapPin } from 'lucide-react';

export const PackagesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Curated Itinerary Packages</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">Ready-to-Travel Packages</h1>
        <p className="text-sm text-gray-500 mt-2">
          Pre-structured travel packages built by destination specialists. Customize any itinerary using our AI builder in one click.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {FEATURED_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
          >
            {/* Image */}
            <div className="sm:w-2/5 relative h-56 sm:h-auto overflow-hidden">
              <img
                src={pkg.image_url}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {pkg.tier} Tier
              </div>
            </div>

            {/* Content */}
            <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-1">
                  <span className="flex items-center gap-1 text-brand-600 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    {pkg.destination}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {pkg.duration_text}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-1">{pkg.name}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{pkg.description}</p>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Package Inclusions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {pkg.inclusions.map((inc, i) => (
                      <div key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Starting From</span>
                  <span className="text-xl font-extrabold text-gray-900">{pkg.price_text}</span>
                </div>
                <Link to={`/plan-trip?city=${pkg.destination.split(',')[0].trim()}&country=${pkg.destination.split(',')[1]?.trim() || ''}`}>
                  <Button variant="primary" size="sm" rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
                    Customize with AI
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
