import { Test, TestingModule } from '@nestjs/testing';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { PrismaService } from '../prisma/prisma.service';
import { PricingPlanService } from './pricing_plan.service';

describe('PricingPlanService', () => {
  let service: PricingPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingPlanService,
        {
          provide: PrismaService,
          useValue: {
            feature: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
            pricing_plan: {
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: BusinessEventsService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PricingPlanService>(PricingPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

