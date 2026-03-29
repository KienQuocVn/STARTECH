import { Injectable } from '@nestjs/common';
import { ResponseServiceDto } from './dto/response-service.dto';
import { PrismaService } from '../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(): Promise<ResponseServiceDto> {
    try {
      const result = await this.prisma.services.findMany({
        orderBy: { id: 'asc' },
        select: { id: true, name: true },
      });

      const responseObject = {
        success: true,
        statusCode: 200,
        message: 'Lấy danh sách dịch vụ thành công',
        data: result,
      };

      return plainToInstance(ResponseServiceDto, responseObject, {
        enableImplicitConversion: true,
      });
    } catch (error) {
      console.error(error);
      return {
        success: false,
        statusCode: 500,
        message: 'Đã xảy ra lỗi khi lấy danh sách dịch vụ',
        data: null,
      };
    }
  }
}
