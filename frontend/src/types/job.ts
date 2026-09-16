export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Job {
  id: number;
  title: string;
  type: string;
  status: JobStatus;
  createdAt: string;
}

export interface CreateJobDto {
  title: string;
  type: string;
}

export interface UpdateStatusDto {
  status: JobStatus;
}

export type StatusFilter = 'all' | JobStatus;

export interface JobCounts {
  all: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
}

export const ALLOWED_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  pending: ['running', 'completed', 'failed'],
  running: ['completed', 'failed'],
  completed: [],
  failed: [],
};
