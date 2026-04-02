import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { StatusCodes } from 'http-status-codes';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessEvents: BusinessEventsService,
  ) {}

  async findAll(): Promise<ResponseCategoryDto> {
    try {
      const result = await this.prisma.category.findMany({
        include: {
          _count: { select: { product_category: true } },
        },
      });

      // Format data
      const formattedResult = result.map((category) => ({
        id: category.id,
        name: category.name,
        product_count: category._count.product_category,
      }));

      const responseObject = {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Lấy danh mục sản phẩm thành công',
        data: formattedResult,
      };

      return plainToInstance(ResponseCategoryDto, responseObject, {
        enableImplicitConversion: true,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Đã xảy ra lỗi khi lấy danh mục sản phẩm',
        data: null,
      });
    }
  }

  async create(createCategoryDto: CreateCategoryDto, actor?: JwtPayload | null) {
    const category = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
      },
    });

    this.businessEvents.log({
      entity: 'category',
      action: 'category.create',
      entityId: category.id,
      actor,
      metadata: {
        name: category.name,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Tao danh muc thanh cong.',
      data: category,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, actor?: JwtPayload | null) {
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
      },
    });

    this.businessEvents.log({
      entity: 'category',
      action: 'category.update',
      entityId: category.id,
      actor,
      metadata: {
        name: category.name,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cap nhat danh muc thanh cong.',
      data: category,
    };
  }

  async remove(id: number, actor?: JwtPayload | null) {
    await this.prisma.category.delete({
      where: { id },
    });

    this.businessEvents.log({
      entity: 'category',
      action: 'category.delete',
      entityId: id,
      actor,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa danh muc thanh cong.',
      data: { id },
    };
  }
}
