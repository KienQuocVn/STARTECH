import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { StatusCodes } from 'http-status-codes';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Tao danh muc thanh cong.',
      data: category,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cap nhat danh muc thanh cong.',
      data: category,
    };
  }

  async remove(id: number) {
    await this.prisma.category.delete({
      where: { id },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa danh muc thanh cong.',
      data: { id },
    };
  }
}
