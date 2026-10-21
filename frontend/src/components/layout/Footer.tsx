import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Globe, Shield, Sparkles, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-rose-400 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <span className="yesteryear-text text-3xl font-bold bg-gradient-to-r from-brand-400 to-rose-400 bg-clip-text text-transparent">
                TravelEase
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Your personalized AI-driven travel architect. We generate realistic day-by-day itineraries, smart budget forecasts, and local insider advice tailored to your journey.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                AI Powered Generation
              </span>
              <span className="flex items-center gap-1.5 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Transparent Budgets
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-brand-400 transition-colors">Explore Destinations</Link>
              </li>
              <li>
                <Link to="/package" className="hover:text-brand-400 transition-colors">Tour Packages</Link>
              </li>
              <li>
                <Link to="/plan-trip" className="hover:text-brand-400 transition-colors">Smart Trip Builder</Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-brand-400 transition-colors">Saved Bookings</Link>
              </li>
            </ul>
          </div>

          {/* Popular Hubs */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Top Destinations</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destinations?q=Jaipur" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" /> Jaipur, India
                </Link>
              </li>
              <li>
                <Link to="/destinations?q=Goa" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" /> Goa Beaches
                </Link>
              </li>
              <li>
                <Link to="/destinations?q=Kyoto" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" /> Kyoto, Japan
                </Link>
              </li>
              <li>
                <Link to="/destinations?q=Paris" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" /> Paris, France
                </Link>
              </li>
              <li>
                <Link to="/destinations?q=Manali" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" /> Manali Valley
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Architecture</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Built with React, Vite, TypeScript, Tailwind CSS, FastAPI, and Supabase PostgreSQL.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Mail className="w-3.5 h-3.5 text-brand-400" />
              <span>demo@travelease.internal</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} TravelEase — Personalized Travel Itinerary Planner. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for travelers with</span>
            <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500 inline" />
            <span>and AI intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
