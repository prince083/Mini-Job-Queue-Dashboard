import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CreateJobDto } from '../types/job';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateJobDto) => Promise<void>;
  isSubmitting: boolean;
}

const QUICK_TYPES = ['data_export', 'email_digest', 'report_generation', 'image_processing'];

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmedTitle = title.trim();
    const trimmedType = type.trim();

    if (!trimmedTitle) {
      setValidationError('Job title is required');
      return;
    }
    if (!trimmedType) {
      setValidationError('Job type is required');
      return;
    }

    try {
      await onSubmit({ title: trimmedTitle, type: trimmedType });
      setTitle('');
      setType('');
      onClose();
    } catch {
      // Handled by parent error state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee-950/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-coffee-200 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-coffee-100 bg-coffee-50/50">
          <div>
            <h2 className="text-sm font-semibold text-coffee-900">
              Create New Job
            </h2>
            <p className="text-xs text-coffee-600">
              Initial status will be set to Pending.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-coffee-400 hover:text-coffee-700 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {validationError && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {validationError}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-coffee-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Generate Monthly Sales Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-xs rounded-md bg-coffee-50/50 border border-coffee-200 text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-coffee-700 mb-1">
              Job Type
            </label>
            <input
              type="text"
              placeholder="e.g. report_generation"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-xs rounded-md bg-coffee-50/50 border border-coffee-200 text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 font-mono"
            />
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-coffee-500">Suggestions:</span>
              {QUICK_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-coffee-100 text-coffee-700 hover:bg-coffee-200 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-coffee-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-medium text-coffee-700 hover:bg-coffee-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-matcha-700 hover:bg-matcha-800 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Create Job</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
