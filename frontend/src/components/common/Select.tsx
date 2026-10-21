import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
          error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
