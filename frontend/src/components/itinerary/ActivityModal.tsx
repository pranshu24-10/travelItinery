import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Activity } from '../../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  activity?: Activity | null;
  dayId?: string;
  tripId?: string;
  currency?: string;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  activity,
  dayId,
  tripId,
  currency = 'USD'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time_of_day: 'morning',
    start_time: '09:00',
    end_time: '10:30',
    duration_minutes: 90,
    location_name: '',
    category: 'Sightseeing',
    estimated_cost: 0,
    transportation_tip: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || '',
        description: activity.description || '',
        time_of_day: activity.time_of_day || 'morning',
        start_time: activity.start_time || '09:00',
        end_time: activity.end_time || '10:30',
        duration_minutes: activity.duration_minutes || 90,
        location_name: activity.location_name || '',
        category: activity.category || 'Sightseeing',
        estimated_cost: activity.estimated_cost || 0,
        transportation_tip: activity.transportation_tip || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        time_of_day: 'morning',
        start_time: '09:00',
        end_time: '10:30',
        duration_minutes: 90,
        location_name: '',
        category: 'Sightseeing',
        estimated_cost: 0,
        transportation_tip: ''
      });
    }
  }, [activity, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      if (activity) {
        await onSave({
          ...formData,
          estimated_cost: Number(formData.estimated_cost)
        });
      } else {
        await onSave({
          ...formData,
          day_id: dayId,
          trip_id: tripId,
          currency,
          estimated_cost: Number(formData.estimated_cost)
        });
      }
      onClose();
    } catch (err) {
      console.error('Failed to save activity', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activity ? 'Edit Itinerary Activity' : 'Add New Activity'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Activity Title *"
          placeholder="e.g. Amber Fort & Mirror Palace Tour"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Time Slot"
            value={formData.time_of_day}
            onChange={(e) => setFormData({ ...formData, time_of_day: e.target.value as any })}
            options={[
              { value: 'morning', label: 'Morning' },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'evening', label: 'Evening' },
            ]}
          />
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Sightseeing', label: 'Sightseeing' },
              { value: 'Food & Dining', label: 'Food & Dining' },
              { value: 'Culture & History', label: 'Culture & History' },
              { value: 'Nature & Adventure', label: 'Nature & Adventure' },
              { value: 'Transport', label: 'Transport' },
              { value: 'Relaxation', label: 'Relaxation' },
              { value: 'Shopping', label: 'Shopping' },
              { value: 'Entertainment', label: 'Entertainment' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Input
            label="Start Time"
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          />
          <Input
            label="End Time"
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
          />
          <Input
            label={`Est. Cost (${currency})`}
            type="number"
            step="0.01"
            min="0"
            value={formData.estimated_cost}
            onChange={(e) => setFormData({ ...formData, estimated_cost: Number(e.target.value) })}
          />
        </div>

        <Input
          label="Location Name"
          placeholder="e.g. Amer, Jaipur, Rajasthan"
          value={formData.location_name}
          onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
        />

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Key highlights, experience details, and tips..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="block w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <Input
          label="Transportation Tip"
          placeholder="e.g. 10 min taxi or Metro Line 2 to Station X"
          value={formData.transportation_tip}
          onChange={(e) => setFormData({ ...formData, transportation_tip: e.target.value })}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {activity ? 'Save Changes' : 'Add Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
