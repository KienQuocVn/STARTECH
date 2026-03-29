import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingPlanDto } from './dto/create-pricing_plan.dto';
import { ResponsePricingPlanDto } from './dto/response-pricing_plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing_plan.dto';

@Injectable()
export class PricingPlanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessEvents: BusinessEventsService,
  ) {}

  private async resolveFeatureIds(payload: { featureIds?: number[]; featureNames?: string[] }) {
    const featureIds = new Set<number>(payload.featureIds ?? []);
    const normalizedNames = Array.from(new Set((payload.featureNames ?? []).map((item) => item.trim()).filter(Boolean)));

    if (normalizedNames.length > 0) {
      const existing = await this.prisma.feature.findMany({
        where: {
          name: {
            in: normalizedNames,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      existing.forEach((item) => featureIds.add(item.id));

      const missingNames = normalizedNames.filter((name) => !existing.some((item) => item.name === name));
      if (missingNames.length > 0) {
        const created = await Promise.all(
          missingNames.map((name) =>
            this.prisma.feature.create({
              data: { name },
              select: { id: true },
            }),
          ),
        );
        created.forEach((item) => featureIds.add(item.id));
      }
    }

    return Array.from(featureIds);
  }

  async findAll(): Promise<ResponsePricingPlanDto> {
    try {
      const result = await this.prisma.pricing_plan.findMany({
        orderBy: { id: 'asc' },
        include: {
          pricing_feature: {
            include: {
              feature: { select: { id: true, name: true, description: true } },
            },
          },
        },
      });

      const formattedResult = result.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price ? Number(plan.price) : null,
        description: plan.description,
        price_Type: plan.price_Type,
        features: plan.pricing_feature.map((pf) => pf.feature),
      }));

      return plainToInstance(
        ResponsePricingPlanDto,
        {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Lay danh sach bang gia thanh cong',
          data: formattedResult,
        },
        {
          enableImplicitConversion: true,
        },
      );
    } catch {
      return {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Da xay ra loi khi lay danh sach bang gia',
        data: null,
      };
    }
  }

  async create(createPricingPlanDto: CreatePricingPlanDto) {
    const featureIds = await this.resolveFeatureIds(createPricingPlanDto);

    const plan = await this.prisma.pricing_plan.create({
      data: {
        name: createPricingPlanDto.name,
        price: createPricingPlanDto.price != null ? new Prisma.Decimal(createPricingPlanDto.price) : null,
        price_Type: createPricingPlanDto.price_Type,
        description: createPricingPlanDto.description ?? null,
        pricing_feature: featureIds.length
          ? {
              create: featureIds.map((featureId) => ({
                feature: {
                  connect: { id: featureId },
                },
              })),
            }
          : undefined,
      },
      include: {
        pricing_feature: {
          include: {
            feature: true,
          },
        },
      },
    });

    this.businessEvents.log({
      entity: 'pricing_plan',
      action: 'pricing.create',
      entityId: plan.id,
      metadata: {
        name: plan.name,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Tao goi gia thanh cong.',
      data: plan,
    };
  }

  async update(id: number, updatePricingPlanDto: UpdatePricingPlanDto) {
    const featureIds =
      updatePricingPlanDto.featureIds || updatePricingPlanDto.featureNames ? await this.resolveFeatureIds(updatePricingPlanDto) : undefined;

    const plan = await this.prisma.pricing_plan.update({
      where: { id },
      data: {
        name: updatePricingPlanDto.name,
        price:
          updatePricingPlanDto.price !== undefined
            ? updatePricingPlanDto.price != null
              ? new Prisma.Decimal(updatePricingPlanDto.price)
              : null
            : undefined,
        price_Type: updatePricingPlanDto.price_Type,
        description: updatePricingPlanDto.description,
        pricing_feature: featureIds
          ? {
              deleteMany: {},
              create: featureIds.map((featureId) => ({
                feature: {
                  connect: { id: featureId },
                },
              })),
            }
          : undefined,
      },
      include: {
        pricing_feature: {
          include: {
            feature: true,
          },
        },
      },
    });

    this.businessEvents.log({
      entity: 'pricing_plan',
      action: 'pricing.update',
      entityId: plan.id,
      metadata: {
        name: plan.name,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cap nhat goi gia thanh cong.',
      data: plan,
    };
  }

  async remove(id: number) {
    await this.prisma.pricing_plan.delete({
      where: { id },
    });

    this.businessEvents.log({
      entity: 'pricing_plan',
      action: 'pricing.delete',
      entityId: id,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa goi gia thanh cong.',
      data: { id },
    };
  }
}
