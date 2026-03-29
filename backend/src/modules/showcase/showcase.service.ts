import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCodes } from 'http-status-codes';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';

@Injectable()
export class ShowcaseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const items = await this.prisma.showcase_item.findMany({
        orderBy: [{ display_order: 'asc' }, { id: 'asc' }],
      });

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Lay danh sach showcase thanh cong.',
        data: items,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Da xay ra loi khi lay du lieu showcase.',
        data: null,
      });
    }
  }

  async create(createShowcaseDto: CreateShowcaseDto) {
    const item = await this.prisma.showcase_item.create({
      data: {
        ...createShowcaseDto,
        website_url: createShowcaseDto.website_url || null,
        display_order: createShowcaseDto.display_order ?? 0,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Tao showcase thanh cong.',
      data: item,
    };
  }

  async update(id: number, updateShowcaseDto: UpdateShowcaseDto) {
    const item = await this.prisma.showcase_item.update({
      where: { id },
      data: updateShowcaseDto,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cap nhat showcase thanh cong.',
      data: item,
    };
  }

  async remove(id: number) {
    await this.prisma.showcase_item.delete({
      where: { id },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa showcase thanh cong.',
      data: { id },
    };
  }
}
