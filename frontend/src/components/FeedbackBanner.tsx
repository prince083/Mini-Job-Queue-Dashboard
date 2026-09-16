import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface FeedbackBannerProps {
  type: 'error' | 'success';
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  type,
  message,
  onDismiss,
  onRetry,
}) => {
  const isError = type === 'error';

  return (
    <div
      className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 text-xs transition-all ${
        isError
          ? 'bg-rose-50 border-rose-200 text-rose-800'
          : 'bg-matcha-50 border-matcha-200 text-matcha-900'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {isError ? (
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-matcha-700 shrink-0" />
        )}
        <span className="font-medium">{message}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isError && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-2.5 py-1 rounded bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 font-medium transition-colors"
          >
            Retry
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded text-coffee-500 hover:text-coffee-800 transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
