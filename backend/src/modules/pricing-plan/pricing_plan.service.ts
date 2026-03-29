import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponsePricingPlanDto } from './dto/response-pricing_plan.dto';
import { plainToInstance } from 'class-transformer';
import { CreatePricingPlanDto } from './dto/create-pricing_plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing_plan.dto';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class PricingPlanService {
  constructor(private readonly prisma: PrismaService) {}

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
        features: plan.pricing_feature.map((pf) => pf.feature),
      }));

      const responseObject = {
        success: true,
        statusCode: 200,
        message: 'Lấy danh sách bảng giá thành công',
        data: formattedResult,
      };

      return plainToInstance(ResponsePricingPlanDto, responseObject, {
        enableImplicitConversion: true,
      });
    } catch (error) {
      console.error(error);
      return {
        success: false,
        statusCode: 500,
        message: 'Đã xảy ra lỗi khi lấy danh sách bảng giá',
        data: null,
      };
    }
  }

  async create(createPricingPlanDto: CreatePricingPlanDto) {
    const plan = await this.prisma.pricing_plan.create({
      data: {
        name: createPricingPlanDto.name,
        price: createPricingPlanDto.price != null ? new Prisma.Decimal(createPricingPlanDto.price) : null,
        price_Type: createPricingPlanDto.price_Type,
        description: createPricingPlanDto.description ?? null,
        pricing_feature: createPricingPlanDto.featureIds?.length
          ? {
              create: createPricingPlanDto.featureIds.map((featureId) => ({
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

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Tao goi gia thanh cong.',
      data: plan,
    };
  }

  async update(id: number, updatePricingPlanDto: UpdatePricingPlanDto) {
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
        pricing_feature: updatePricingPlanDto.featureIds
          ? {
              deleteMany: {},
              create: updatePricingPlanDto.featureIds.map((featureId) => ({
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

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa goi gia thanh cong.',
      data: { id },
    };
  }
}
