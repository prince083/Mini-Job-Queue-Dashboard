import React from 'react';
import { ListFilter, Clock, PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { JobCounts, StatusFilter } from '../types/job';

interface StatusCardsProps {
  counts: JobCounts;
  activeFilter: StatusFilter;
  onSelectFilter: (filter: StatusFilter) => void;
}

export const StatusCards: React.FC<StatusCardsProps> = ({
  counts,
  activeFilter,
  onSelectFilter,
}) => {
  const cards: Array<{
    key: StatusFilter;
    label: string;
    count: number;
    icon: React.ReactNode;
    activeBorder: string;
    badgeBg: string;
  }> = [
    {
      key: 'all',
      label: 'Total Jobs',
      count: counts.all,
      icon: <ListFilter className="w-4 h-4 text-coffee-600" />,
      activeBorder: 'border-coffee-700 ring-1 ring-coffee-700',
      badgeBg: 'bg-coffee-100 text-coffee-800',
    },
    {
      key: 'pending',
      label: 'Pending',
      count: counts.pending,
      icon: <Clock className="w-4 h-4 text-amber-700" />,
      activeBorder: 'border-amber-700 ring-1 ring-amber-700',
      badgeBg: 'bg-amber-50 text-amber-800',
    },
    {
      key: 'running',
      label: 'Running',
      count: counts.running,
      icon: <PlayCircle className="w-4 h-4 text-matcha-600" />,
      activeBorder: 'border-matcha-600 ring-1 ring-matcha-600',
      badgeBg: 'bg-matcha-100 text-matcha-800',
    },
    {
      key: 'completed',
      label: 'Completed',
      count: counts.completed,
      icon: <CheckCircle2 className="w-4 h-4 text-matcha-700" />,
      activeBorder: 'border-matcha-700 ring-1 ring-matcha-700',
      badgeBg: 'bg-matcha-50 text-matcha-900',
    },
    {
      key: 'failed',
      label: 'Failed',
      count: counts.failed,
      icon: <AlertCircle className="w-4 h-4 text-rose-700" />,
      activeBorder: 'border-rose-600 ring-1 ring-rose-600',
      badgeBg: 'bg-rose-50 text-rose-800',
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map((card) => {
        const isSelected = activeFilter === card.key;
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelectFilter(card.key)}
            className={`text-left p-4 rounded-lg bg-white border transition-all shadow-sm hover:border-coffee-300 ${
              isSelected ? card.activeBorder : 'border-coffee-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium uppercase tracking-wider text-coffee-600">
                {card.label}
              </span>
              <div className="p-1.5 rounded-md bg-coffee-50">{card.icon}</div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-coffee-900">
                {card.count}
              </span>
              {isSelected && (
                <span className="text-[11px] font-medium text-coffee-600">
                  Filtered
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
