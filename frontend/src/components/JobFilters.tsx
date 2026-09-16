import React from 'react';
import { Search, X } from 'lucide-react';
import { StatusFilter } from '../types/job';

interface JobFiltersProps {
  activeFilter: StatusFilter;
  onSelectFilter: (filter: StatusFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFiltered: number;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  activeFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
  totalFiltered,
}) => {
  const tabs: Array<{ key: StatusFilter; label: string }> = [
    { key: 'all', label: 'All Jobs' },
    { key: 'pending', label: 'Pending' },
    { key: 'running', label: 'Running' },
    { key: 'completed', label: 'Completed' },
    { key: 'failed', label: 'Failed' },
  ];

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-1 bg-coffee-100/60 p-1 rounded-lg border border-coffee-200">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white text-coffee-900 shadow-sm'
                  : 'text-coffee-700 hover:text-coffee-900 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-coffee-600 font-medium">
          Showing {totalFiltered} jobs
        </span>
        <div className="relative w-64">
          <Search className="w-4 h-4 text-coffee-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or type..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-md bg-white border border-coffee-200 placeholder:text-coffee-400 focus:outline-none focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
