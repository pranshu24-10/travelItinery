import React from 'react';
import { TripBuilderWizard } from '../components/builder/TripBuilderWizard';

export const PlanTripPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-xl mx-auto mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Smart Trip Architect</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">Plan Your Dream Journey</h1>
        <p className="text-sm text-gray-500 mt-2">
          Tell us where you want to go and what you love. Our AI engine will engineer a realistic, day-by-day itinerary tailored to your pace and budget.
        </p>
      </div>

      <TripBuilderWizard />
    </div>
  );
};
