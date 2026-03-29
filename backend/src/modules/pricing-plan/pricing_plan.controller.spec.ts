import { Test, TestingModule } from '@nestjs/testing';
import { PricingPlanController } from './pricing_plan.controller';
import { PricingPlanService } from './pricing_plan.service';

describe('PricingPlanController', () => {
  let controller: PricingPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingPlanController],
      providers: [PricingPlanService],
    }).compile();

    controller = module.get<PricingPlanController>(PricingPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
