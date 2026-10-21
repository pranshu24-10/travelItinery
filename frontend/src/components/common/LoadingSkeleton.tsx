import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="space-y-4 animate-pulse w-full">
      <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
      <div className="space-y-3 pt-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl w-full border border-gray-200/50"></div>
        ))}
      </div>
    </div>
  );
};
