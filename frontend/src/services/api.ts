import axios, { AxiosError } from 'axios';
import { Job, CreateJobDto, UpdateStatusDto } from '../types/job';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  async getJobs(): Promise<Job[]> {
    const response = await client.get<Job[]>('/jobs');
    return response.data;
  },

  async createJob(dto: CreateJobDto): Promise<Job> {
    const response = await client.post<Job>('/jobs', dto);
    return response.data;
  },

  async updateJobStatus(id: number, statusDto: UpdateStatusDto): Promise<Job> {
    const response = await client.patch<Job>(`/jobs/${id}/status`, statusDto);
    return response.data;
  },

  async deleteJob(id: number): Promise<void> {
    await client.delete(`/jobs/${id}`);
  },
};

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string | string[]; error?: string }>;
    if (axiosErr.response?.data?.message) {
      const msg = axiosErr.response.data.message;
      return Array.isArray(msg) ? msg.join(', ') : msg;
    }
    if (axiosErr.response?.data?.error) {
      return axiosErr.response.data.error;
    }
    if (axiosErr.message) {
      return axiosErr.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
