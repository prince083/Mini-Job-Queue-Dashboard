import React, { useState } from 'react';
import { Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { Job, JobStatus, ALLOWED_TRANSITIONS } from '../types/job';

interface JobTableProps {
  jobs: Job[];
  onUpdateStatus: (id: number, status: JobStatus) => Promise<void>;
  onDeleteJob: (id: number) => Promise<void>;
  actionPendingId: number | null;
}

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  onUpdateStatus,
  onDeleteJob,
  actionPendingId,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const formatTimestamp = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            Pending
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-matcha-100 text-matcha-800 border border-matcha-300">
            Running
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-matcha-700 text-white border border-matcha-800">
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-coffee-100 text-coffee-800">
            {status}
          </span>
        );
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-coffee-200 p-12 text-center">
        <p className="text-sm font-medium text-coffee-800">No jobs found</p>
        <p className="text-xs text-coffee-500 mt-1">
          Try changing your filter criteria or create a new job.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-coffee-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-coffee-200 bg-coffee-50/70 text-[11px] font-semibold uppercase tracking-wider text-coffee-700">
              <th className="py-3 px-4 w-16">ID</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4 w-32">Type</th>
              <th className="py-3 px-4 w-32">Status</th>
              <th className="py-3 px-4 w-52">Created At</th>
              <th className="py-3 px-4 w-60">Change Status</th>
              <th className="py-3 px-4 w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-coffee-100 text-xs">
            {jobs.map((job) => {
              const isOperating = actionPendingId === job.id;
              const allowedNextStatuses = ALLOWED_TRANSITIONS[job.status] || [];
              const isTerminal = allowedNextStatuses.length === 0;

              return (
                <tr
                  key={job.id}
                  className="hover:bg-coffee-50/50 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-coffee-600">
                    #{job.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-coffee-900">
                    {job.title}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block font-mono text-[11px] bg-coffee-100 px-2 py-0.5 rounded text-coffee-800">
                      {job.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(job.status)}</td>
                  <td className="py-3 px-4 text-coffee-600 font-mono text-[11px]">
                    {formatTimestamp(job.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    {isTerminal ? (
                      <span className="text-[11px] text-coffee-400 italic">
                        Terminal state
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-coffee-400 shrink-0" />
                        <select
                          disabled={isOperating}
                          value=""
                          onChange={(e) => {
                            const newStatus = e.target.value as JobStatus;
                            if (newStatus) {
                              onUpdateStatus(job.id, newStatus);
                            }
                          }}
                          className="text-xs bg-coffee-50 border border-coffee-200 rounded px-2 py-1 text-coffee-800 focus:outline-none focus:ring-1 focus:ring-matcha-500 disabled:opacity-50"
                        >
                          <option value="" disabled>
                            Move to...
                          </option>
                          {allowedNextStatuses.map((s) => (
                            <option key={s} value={s}>
                              {s.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isOperating ? (
                      <div className="inline-flex items-center justify-end">
                        <Loader2 className="w-4 h-4 text-coffee-600 animate-spin" />
                      </div>
                    ) : deleteConfirmId === job.id ? (
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteJob(job.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-medium transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-0.5 rounded bg-coffee-100 hover:bg-coffee-200 text-coffee-700 text-[11px] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(job.id)}
                        className="p-1 rounded text-coffee-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
