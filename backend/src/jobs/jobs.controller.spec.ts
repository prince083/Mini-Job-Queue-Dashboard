import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller.js';
import { JobsService } from './jobs.service.js';

describe('JobsController', () => {
  let controller: JobsController;

  const mockJobsService = {
    findAll: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: mockJobsService,
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
