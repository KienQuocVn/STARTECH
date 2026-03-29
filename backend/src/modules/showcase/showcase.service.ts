import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCodes } from 'http-status-codes';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';

@Injectable()
export class ShowcaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessEvents: BusinessEventsService,
  ) {}

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
    } catch {
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

    this.businessEvents.log({
      entity: 'showcase_item',
      action: 'showcase.create',
      entityId: item.id,
      metadata: {
        name: item.name,
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

    this.businessEvents.log({
      entity: 'showcase_item',
      action: 'showcase.update',
      entityId: item.id,
      metadata: updateShowcaseDto as Record<string, unknown>,
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

    this.businessEvents.log({
      entity: 'showcase_item',
      action: 'showcase.delete',
      entityId: id,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa showcase thanh cong.',
      data: { id },
    };
  }
}
