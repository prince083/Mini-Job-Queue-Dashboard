import { Body, Controller, Get, Delete, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';

import { JobsService } from './jobs.service.js';
import { CreateJobDto } from './create-job.dto.js';
import { UpdateStatusDto } from './update-status.dto.js';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Post()
    create(@Body() createJobDto: CreateJobDto) {
        return this.jobsService.create(createJobDto);
    }

    @Get()
    findAll() {
        return this.jobsService.findAll();
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStatusDto: UpdateStatusDto,
    ) {
        return this.jobsService.updateStatus(id, updateStatusDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.jobsService.remove(id);
    }
}