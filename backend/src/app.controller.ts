import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from './modules/prisma/prisma.service';

@ApiTags('Health')
@SkipThrottle()
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  @ApiOperation({ summary: 'Kiem tra trang thai dich vu va ket noi database' })
  @ApiResponse({
    status: 200,
    description: 'Dich vu dang chay binh thuong.',
  })
  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Health check thanh cong.',
        data: {
          status: 'ok',
          database: 'connected',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Health check that bai.',
        data: {
          status: 'error',
          database: 'disconnected',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          error: message,
        },
      };
    }
  }
}
