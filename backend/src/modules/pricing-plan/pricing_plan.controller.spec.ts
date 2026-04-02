import { Test, TestingModule } from '@nestjs/testing';
import { PricingPlanController } from './pricing_plan.controller';
import { PricingPlanService } from './pricing_plan.service';

describe('PricingPlanController', () => {
  let controller: PricingPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingPlanController],
      providers: [
        {
          provide: PricingPlanService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PricingPlanController>(PricingPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
