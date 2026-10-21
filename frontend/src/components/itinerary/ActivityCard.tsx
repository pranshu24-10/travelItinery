import React, { useState } from 'react';
import { Activity } from '../../types';
import { 
  Clock, 
  MapPin, 
  Navigation, 
  DollarSign, 
  Edit3, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Camera, 
  Utensils, 
  Landmark, 
  TreePine, 
  Bus, 
  Sparkles,
  ShoppingBag,
  Ticket
} from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  isFirst: boolean;
  isLast: boolean;
  readOnly?: boolean;
  onEdit?: (act: Activity) => void;
  onDelete?: (actId: string) => void;
  onMoveUp?: (actId: string) => void;
  onMoveDown?: (actId: string) => void;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return <Utensils className="w-4 h-4 text-amber-500" />;
  if (cat.includes('culture') || cat.includes('history')) return <Landmark className="w-4 h-4 text-indigo-500" />;
  if (cat.includes('nature') || cat.includes('adventure')) return <TreePine className="w-4 h-4 text-emerald-500" />;
  if (cat.includes('transport')) return <Bus className="w-4 h-4 text-blue-500" />;
  if (cat.includes('shopping')) return <ShoppingBag className="w-4 h-4 text-rose-500" />;
  if (cat.includes('entertainment')) return <Ticket className="w-4 h-4 text-purple-500" />;
  return <Camera className="w-4 h-4 text-brand-500" />;
};

const getTimeBadge = (tod: string) => {
  const t = tod.toLowerCase();
  if (t === 'morning') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (t === 'afternoon') return 'bg-sky-50 text-sky-700 border-sky-200';
  return 'bg-purple-50 text-purple-700 border-purple-200';
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isFirst,
  isLast,
  readOnly = false,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Delete activity "${activity.title}"?`)) {
      setIsDeleting(true);
      onDelete?.(activity.id);
    }
  };

  return (
    <div className={`group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        
        {/* Left: Content */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTimeBadge(activity.time_of_day)}`}>
              {activity.time_of_day}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">
              {getCategoryIcon(activity.category)}
              {activity.category}
            </span>
            {activity.start_time && (
              <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {activity.start_time} - {activity.end_time || `${activity.duration_minutes}m`}
              </span>
            )}
          </div>

          <h4 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
            {activity.title}
          </h4>

          {activity.description && (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              {activity.description}
            </p>
          )}

          {activity.location_name && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium pt-1">
              <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              <span className="truncate">{activity.location_name}</span>
            </div>
          )}

          {activity.transportation_tip && (
            <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50/70 px-3 py-1.5 rounded-xl border border-blue-100/60 mt-2">
              <Navigation className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              <span>{activity.transportation_tip}</span>
            </div>
          )}
        </div>

        {/* Right: Cost & Actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Est. Cost</span>
            <span className="text-base font-extrabold text-gray-900">
              {activity.estimated_cost === 0 ? 'Free' : `${activity.currency} ${activity.estimated_cost.toFixed(2)}`}
            </span>
          </div>

          {!readOnly && (
            <div className="flex items-center gap-1 no-print">
              <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-200">
                <button
                  type="button"
                  title="Move Up"
                  disabled={isFirst}
                  onClick={() => onMoveUp?.(activity.id)}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 rounded transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Move Down"
                  disabled={isLast}
                  onClick={() => onMoveDown?.(activity.id)}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 rounded transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                title="Edit Activity"
                onClick={() => onEdit?.(activity)}
                className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-200"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Delete Activity"
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
