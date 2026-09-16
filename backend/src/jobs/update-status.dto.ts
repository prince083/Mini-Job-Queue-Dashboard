import { IsIn } from 'class-validator';
import { JobStatus } from './job.entity.js';

export class UpdateStatusDto {
  @IsIn(Object.values(JobStatus))
  status: JobStatus;
}