import { Controller, Get } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiOperation({ summary: 'Lấy danh sách dịch vụ' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách dịch vụ được lấy thành công.',
    example: {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách dịch vụ thành công',
      data: [
        {
          id: 1,
          name: 'Lập trình Frontend',
        },
        {
          id: 2,
          name: 'Bảo trì và hỗ trợ',
        },
        {
          id: 3,
          name: 'Lập trình Backend',
        },
        {
          id: 4,
          name: 'Tối ưu SEO',
        },
        {
          id: 5,
          name: 'Thiết kế UI/UX',
        },
        {
          id: 6,
          name: 'Quản lý hosting',
        },
        {
          id: 7,
          name: 'Tích hợp thanh toán',
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Đã xảy ra lỗi khi lấy danh sách dịch vụ.',
    example: {
      success: false,
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi lấy danh sách dịch vụ',
      data: null,
    },
  })
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }
}
