import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseCreateFeedbackDto, ResponseFeedbackPaginatedDto } from './dto/response-feedback.dto';
import { plainToInstance } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly businessEvents: BusinessEventsService,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<ResponseCreateFeedbackDto> {
    try {
      const result = await this.prismaService.feedback.create({
        data: createFeedbackDto,
      });

      this.businessEvents.log({
        entity: 'feedback',
        action: 'feedback.create',
        entityId: result.id,
        metadata: {
          name: result.name,
        },
      });

      // Format the response
      const formattedResult = {
        ...result,
        rating: result.rating.toString(),
      };

      const response = {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Tạo phản hồi thành công',
        data: formattedResult,
      };

      return plainToInstance(ResponseCreateFeedbackDto, response, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Đã xảy ra lỗi khi tạo phản hồi',
        data: null,
      });
    }
  }

  async findAll(query: PaginationDto): Promise<ResponseFeedbackPaginatedDto> {
    try {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        this.prismaService.feedback.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prismaService.feedback.count(),
      ]);

      // Format ratings to number
      const formattedItems = items.map((item) => ({
        ...item,
        rating: parseFloat(item.rating.toString()),
      }));

      const responseObject = {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Lấy danh sách phản hồi thành công',
        data: {
          items: formattedItems,
          total: total,
          page: page,
          limit: limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };

      return plainToInstance(ResponseFeedbackPaginatedDto, responseObject, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,

        message: `Đã xảy ra lỗi khi lấy danh sách phản hồi`,
        data: null,
      });
    }
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto, actor?: JwtPayload | null) {
    const result = await this.prismaService.feedback.update({
      where: { id },
      data: updateFeedbackDto,
    });

    this.businessEvents.log({
      entity: 'feedback',
      action: 'feedback.update',
      entityId: id,
      actor,
      metadata: updateFeedbackDto as Record<string, unknown>,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cap nhat phan hoi thanh cong',
      data: {
        ...result,
        rating: Number(result.rating),
      },
    };
  }

  async remove(id: number, actor?: JwtPayload | null) {
    await this.prismaService.feedback.delete({
      where: { id },
    });

    this.businessEvents.log({
      entity: 'feedback',
      action: 'feedback.delete',
      entityId: id,
      actor,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa phan hoi thanh cong',
      data: { id },
    };
  }
}
