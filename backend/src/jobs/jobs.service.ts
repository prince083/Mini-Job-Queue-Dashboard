import { Injectable,
    ConflictException,
    NotFoundException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Job, JobStatus } from './job.entity.js';
import { CreateJobDto } from './create-job.dto.js';
import { UpdateStatusDto } from './update-status.dto.js';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(Job)
        private readonly jobsRepository: Repository<Job>,
    ) { }

    async create(createJobDto: CreateJobDto): Promise<Job> {
        const job = this.jobsRepository.create(createJobDto);

        return this.jobsRepository.save(job);
    }

    async findAll(): Promise<Job[]> {
        return this.jobsRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async updateStatus(
        id: number,
        updateStatusDto: UpdateStatusDto,
    ): Promise<Job> {
        const job = await this.jobsRepository.findOne({
            where: { id },
        });

        // 1. Check whether job exists
        if (!job) {
            throw new NotFoundException(`Job with id ${id} not found`);
        }

        const currentStatus = job.status;
        const newStatus = updateStatusDto.status;

        // 2. If status is already the same
        if (currentStatus === newStatus) {
            throw new ConflictException(
                `Job is already in '${currentStatus}' status`,
            );
        }

        // 3. Check whether transition is allowed
        const allowedTransitions: Record<JobStatus, JobStatus[]> = {
            [JobStatus.PENDING]: [JobStatus.RUNNING, JobStatus.FAILED, JobStatus.COMPLETED],

            [JobStatus.RUNNING]: [JobStatus.COMPLETED, JobStatus.FAILED],

            [JobStatus.COMPLETED]: [],

            [JobStatus.FAILED]: [],
        };

        const allowed = allowedTransitions[currentStatus].includes(newStatus);

        if (!allowed) {
            throw new ConflictException(
                `Invalid status transition: ${currentStatus} → ${newStatus}`,
            );
        }

        // 4. Atomically update only if the status
        //    is still the status we originally read.
        const result = await this.jobsRepository.update(
            {
                id,
                status: currentStatus,
            },
            {
                status: newStatus,
            },
        );

        // 5. If no row was updated, another request changed it first
        if (result.affected === 0) {
            throw new ConflictException(
                'Job status was changed by another request. Please try again.',
            );
        }

        // 6. Return the updated job
        const updatedJob = await this.jobsRepository.findOne({
            where: { id },
        });

        if (!updatedJob) {
            throw new NotFoundException(`Job with id ${id} not found`);
        }

        return updatedJob;
    }

    async remove(id: number): Promise<void> {
        const job = await this.jobsRepository.findOne({
            where: { id },
        });

        if (!job) {
            throw new NotFoundException(`Job with id ${id} not found`);
        }

        await this.jobsRepository.remove(job);
    }
}