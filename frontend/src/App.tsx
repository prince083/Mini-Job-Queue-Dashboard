import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api, extractErrorMessage } from './services/api';
import { Job, JobStatus, StatusFilter, JobCounts, CreateJobDto } from './types/job';
import { Header } from './components/Header';
import { StatusCards } from './components/StatusCards';
import { JobFilters } from './components/JobFilters';
import { JobTable } from './components/JobTable';
import { CreateJobModal } from './components/CreateJobModal';
import { FeedbackBanner } from './components/FeedbackBanner';
import { LoadingSkeleton } from './components/LoadingSkeleton';

export const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionPendingId, setActionPendingId] = useState<number | null>(null);

  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadJobs = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage(null);

    try {
      const data = await api.getJobs();
      setJobs(data);
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const counts: JobCounts = useMemo(() => {
    return {
      all: jobs.length,
      pending: jobs.filter((j) => j.status === 'pending').length,
      running: jobs.filter((j) => j.status === 'running').length,
      completed: jobs.filter((j) => j.status === 'completed').length,
      failed: jobs.filter((j) => j.status === 'failed').length,
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesStatus =
        activeFilter === 'all' ? true : job.status === activeFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        job.title.toLowerCase().includes(query) ||
        job.type.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [jobs, activeFilter, searchQuery]);

  const handleCreateJob = async (dto: CreateJobDto) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const newJob = await api.createJob(dto);
      setJobs((prev) => [newJob, ...prev]);
      setSuccessMessage(`Job #${newJob.id} "${newJob.title}" created successfully`);
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: number, nextStatus: JobStatus) => {
    setActionPendingId(id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updated = await api.updateJobStatus(id, { status: nextStatus });
      setJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status: updated.status } : job)),
      );
      setSuccessMessage(`Job #${id} status updated to ${nextStatus.toUpperCase()}`);
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setActionPendingId(null);
    }
  };

  const handleDeleteJob = async (id: number) => {
    setActionPendingId(id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await api.deleteJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      setSuccessMessage(`Job #${id} deleted successfully`);
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setActionPendingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col">
      <Header
        onRefresh={() => loadJobs(true)}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        isLoading={isRefreshing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        {errorMessage && (
          <FeedbackBanner
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            onRetry={() => loadJobs()}
          />
        )}

        {successMessage && (
          <FeedbackBanner
            type="success"
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <StatusCards
              counts={counts}
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
            />

            <JobFilters
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalFiltered={filteredJobs.length}
            />

            <JobTable
              jobs={filteredJobs}
              onUpdateStatus={handleUpdateStatus}
              onDeleteJob={handleDeleteJob}
              actionPendingId={actionPendingId}
            />
          </>
        )}
      </main>

      <footer className="border-t border-coffee-200 py-4 text-center text-xs text-coffee-500">
        Job Orchestration System - Minimalist Desktop Interface
      </footer>

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateJob}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
