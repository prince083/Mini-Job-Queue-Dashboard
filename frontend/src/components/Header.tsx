import React from 'react';
import { Layers, RotateCw, Plus } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  onOpenCreate: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, onOpenCreate, isLoading }) => {
  return (
    <header className="border-b border-coffee-200 bg-[#FCFBF8] sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-matcha-600 text-white flex items-center justify-center shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-coffee-900">
              Job Orchestrator
            </h1>
            <p className="text-xs text-coffee-600">
              Desktop Management Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-coffee-200 bg-white hover:bg-coffee-50 text-coffee-700 text-sm font-medium transition-colors disabled:opacity-50"
            title="Refresh jobs"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-matcha-600' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-matcha-700 hover:bg-matcha-800 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Job</span>
          </button>
        </div>
      </div>
    </header>
  );
};
