import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PricingPlanService } from './pricing_plan.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePricingPlanDto } from './dto/create-pricing_plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing_plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Pricing Plan')
@Controller('pricing-plan')
export class PricingPlanController {
  constructor(private readonly pricingPlanService: PricingPlanService) {}

  @ApiOperation({ summary: 'Lấy danh sách gói cước' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách gói cước được trả về thành công.',
    example: {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách bảng giá thành công',
      data: [
        {
          id: 1,
          name: 'Gói Chuyên nghiệp',
          price: 25000000,
          description: 'Giải pháp toàn diện cho doanh nghiệp lớn',
          features: [
            {
              id: 3,
              name: 'Thiết kế responsive',
              description: 'Website hiển thị tối ưu trên mọi thiết bị: desktop, tablet, mobile',
            },
            {
              id: 7,
              name: 'Tối ưu SEO cơ bản',
              description: 'Tối ưu on-page SEO, meta tags, sitemap và tốc độ tải trang',
            },
            {
              id: 6,
              name: 'Tích hợp thanh toán',
              description: 'Tích hợp cổng thanh toán VNPay, Momo, ZaloPay và chuyển khoản ngân hàng',
            },
            {
              id: 2,
              name: 'Quản lý nội dung (CMS)',
              description: 'Hệ thống quản lý nội dung cho phép cập nhật thông tin dễ dàng',
            },
            {
              id: 4,
              name: 'Chat trực tuyến',
              description: 'Tích hợp chat box hỗ trợ khách hàng 24/7 với Zalo, Facebook Messenger',
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Đã xảy ra lỗi khi lấy danh sách gói cước.',
    example: {
      success: false,
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi lấy danh sách bảng giá',
      data: null,
    },
  })
  @Get()
  findAll() {
    return this.pricingPlanService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Tao goi gia admin' })
  create(@Body() createPricingPlanDto: CreatePricingPlanDto) {
    return this.pricingPlanService.create(createPricingPlanDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Cap nhat goi gia admin' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePricingPlanDto: UpdatePricingPlanDto) {
    return this.pricingPlanService.update(id, updatePricingPlanDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Xoa goi gia admin' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pricingPlanService.remove(id);
  }
}
