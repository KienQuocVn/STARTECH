import { Module } from '@nestjs/common';
import { PricingPlanService } from './pricing_plan.service';
import { PricingPlanController } from './pricing_plan.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PricingPlanController],
  providers: [PricingPlanService],
})
export class PricingPlanModule {}
