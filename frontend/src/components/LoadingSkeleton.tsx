import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-coffee-100/70 rounded-lg border border-coffee-200/60 p-4">
            <div className="h-3 w-16 bg-coffee-200/60 rounded mb-4" />
            <div className="h-6 w-10 bg-coffee-200/80 rounded" />
          </div>
        ))}
      </div>

      <div className="h-10 bg-coffee-100/50 rounded-lg border border-coffee-200/60" />

      <div className="bg-white rounded-lg border border-coffee-200 p-6 space-y-4">
        <div className="h-4 bg-coffee-100/80 rounded w-1/4" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-coffee-50 rounded border border-coffee-100/60" />
          ))}
        </div>
      </div>
    </div>
  );
};
