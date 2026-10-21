import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { User, Check, Sparkles, Shield, Heart } from 'lucide-react';

const INTEREST_OPTIONS = [
  'Culture & History',
  'Food & Dining',
  'Nature & Parks',
  'Adventure Sports',
  'Beaches & Coastline',
  'Shopping & Bazaars',
  'Nightlife & Lounges',
  'Photography Spots',
  'Wellness & Relaxation',
  'Spiritual & Sacred'
];

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [preferredCurrency, setPreferredCurrency] = useState(user?.preferred_currency || 'USD');
  const [preferredStyle, setPreferredStyle] = useState(user?.preferred_travel_style || 'balanced');
  const [dietary, setDietary] = useState(user?.dietary_preferences || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.favorite_interests || []);
  const [newPassword, setNewPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    try {
      await api.updateProfile({
        full_name: fullName,
        preferred_currency: preferredCurrency,
        preferred_travel_style: preferredStyle,
        dietary_preferences: dietary,
        favorite_interests: selectedInterests,
        ...(newPassword.trim() ? { password: newPassword.trim() } : {})
      } as any);

      await refreshUser();
      setSuccessMsg('Profile settings saved successfully!');
      setNewPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Account Settings</span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Profile & Travel Preferences</h1>
        <p className="text-sm text-gray-500 mt-1">
          Customize your default travel pace, preferred currency, and interests for faster itinerary generation.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
        
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Account Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Morgan"
            />
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              helperText="Managed through authentication credentials."
            />
          </div>
        </div>

        {/* Travel Defaults */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Travel Defaults</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Preferred Currency"
              value={preferredCurrency}
              onChange={(e) => setPreferredCurrency(e.target.value)}
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
            <Select
              label="Preferred Pace"
              value={preferredStyle}
              onChange={(e) => setPreferredStyle(e.target.value)}
              options={[
                { value: 'relaxed', label: 'Relaxed (Leisurely)' },
                { value: 'balanced', label: 'Balanced (Standard)' },
                { value: 'packed', label: 'Action-Packed (High Activity)' },
              ]}
            />
          </div>

          <Input
            label="Dietary Restrictions"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder="e.g. Vegetarian, Vegan, Halal, Gluten-free, Nut allergy"
          />
        </div>

        {/* Favorite Interests */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Favorite Travel Themes</h3>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((item) => {
              const active = selectedInterests.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                    active
                      ? 'bg-brand-50 border-brand-500 text-brand-600 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Password */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Security</h3>
          <Input
            label="Change Password"
            type="password"
            placeholder="Leave blank to keep current password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSaving} leftIcon={<Sparkles className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </form>

    </div>
  );
};
