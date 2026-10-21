import React from 'react';
import { BudgetAnalytics } from '../../types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  PieChart as PieIcon, 
  Calendar 
} from 'lucide-react';

interface BudgetOverviewProps {
  analytics: BudgetAnalytics;
}

const CATEGORY_COLORS = [
  '#e15c76', // Brand Coral
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#6366f1', // Indigo
  '#94a3b8'  // Gray
];

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ analytics }) => {
  const {
    total_budget,
    currency,
    total_estimated_spending,
    remaining_budget,
    cost_per_traveler,
    traveler_count,
    is_over_budget,
    overage_amount,
    daily_breakdown,
    category_breakdown,
    disclaimer
  } = analytics;

  return (
    <div className="space-y-6">
      {/* Alert if over budget */}
      {is_over_budget && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-900">Budget Limit Exceeded</h4>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Your estimated spending exceeds the assigned budget by {currency} {overage_amount.toFixed(2)}. 
              Consider adjusting activity categories, selecting moderate dining, or increasing your budget target.
            </p>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Budget</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {currency} {total_budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">Assigned budget</span>
        </div>

        {/* Estimated Spending */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Est. Spending</span>
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {currency} {total_estimated_spending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-brand-600 font-medium">Activities + Lodging est.</span>
        </div>

        {/* Remaining Budget */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Remaining</span>
            <div className={`p-2 rounded-xl ${remaining_budget >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-extrabold ${remaining_budget >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {currency} {remaining_budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">
            {remaining_budget >= 0 ? 'Available surplus' : 'Deficit'}
          </span>
        </div>

        {/* Cost Per Traveler */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Per Traveler</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {currency} {cost_per_traveler.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">{traveler_count} traveler{traveler_count > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown (Donut Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-gray-900">Spending by Category</h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={category_breakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {category_breakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: any) => [`${currency} ${Number(value).toFixed(2)}`, 'Cost']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category legend */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
            {category_breakdown.map((item, idx) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span className="text-gray-600 truncate">{item.category}</span>
                </div>
                <span className="font-semibold text-gray-900 ml-2">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending Breakdown (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-gray-900">Daily Spending Forecast</h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily_breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day_number"
                  tickFormatter={(val) => `Day ${val}`}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `${val}`}
                />
                <RechartsTooltip
                  formatter={(val: any) => [`${currency} ${Number(val).toFixed(2)}`, 'Estimated Cost']}
                  labelFormatter={(lbl) => `Day ${lbl}`}
                />
                <Bar dataKey="estimated_cost" fill="#e15c76" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              {daily_breakdown.length} day{daily_breakdown.length > 1 ? 's' : ''} planned across all itinerary activities.
            </p>
          </div>
        </div>
      </div>

      {/* Transparent Disclaimer */}
      <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/60 text-[11px] text-gray-500 leading-relaxed text-center">
        {disclaimer}
      </div>
    </div>
  );
};
