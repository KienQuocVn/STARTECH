import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ResponseServiceDto } from './dto/response-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessEvents: BusinessEventsService,
  ) {}

  async findAll(): Promise<ResponseServiceDto> {
    try {
      const result = await this.prisma.service.findMany({
        orderBy: { id: 'asc' },
        select: { id: true, name: true },
      });

      return plainToInstance(
        ResponseServiceDto,
        {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Lay danh sach dich vu thanh cong',
          data: result,
        },
        {
          enableImplicitConversion: true,
        },
      );
    } catch {
      throw new InternalServerErrorException({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Da xay ra loi khi lay danh sach dich vu',
        data: null,
      });
    }
  }

  async create(createServiceDto: CreateServiceDto, actor?: JwtPayload | null) {
    const service = await this.prisma.service.create({
      data: {
        name: createServiceDto.name,
      },
    });

    this.businessEvents.log({
      entity: 'services',
      action: 'service.create',
      entityId: service.id,
      actor,
      metadata: {
        name: service.name,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Tao dich vu thanh cong.',
      data: service,
    };
  }

  async update(id: number, updateServiceDto: UpdateServiceDto, actor?: JwtPayload | null) {
    const service = await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });

    this.businessEvents.log({
      entity: 'services',
      action: 'service.update',
      entityId: service.id,
      actor,
      metadata: updateServiceDto as Record<string, unknown>,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cap nhat dich vu thanh cong.',
      data: service,
    };
  }

  async remove(id: number, actor?: JwtPayload | null) {
    await this.prisma.service.delete({
      where: { id },
    });

    this.businessEvents.log({
      entity: 'services',
      action: 'service.delete',
      entityId: id,
      actor,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa dich vu thanh cong.',
      data: { id },
    };
  }
}

