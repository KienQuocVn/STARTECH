import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Permissions } from '../auth/permissions.decorator';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiOperation({ summary: 'Tạo phản hồi mới' })
  @ApiResponse({
    status: 201,
    description: 'Phản hồi được tạo thành công.',
    example: {
      success: true,
      statusCode: 201,
      message: 'Tạo phản hồi thành công',
      data: {
        id: 7,
        name: 'Nguyễn Văn A',
        comment: 'Tôi rất hài lòng với dịch vụ...',
        rating: 5,
        createdAt: '2025-10-10T15:09:22.494Z',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi máy chủ nội bộ.',
    example: {
      success: false,
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi tạo phản hồi',
      data: null,
    },
  })
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @ApiOperation({ summary: 'Lấy phản hồi với phân trang' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách phản hồi được lấy thành công.',
    example: {
      success: true,
      statusCode: 200,
      message: 'Lấy danh sách phản hồi thành công',
      data: {
        items: [
          {
            id: 10,
            name: 'Nguyễn Văn A',
            comment: 'Tôi rất hài lòng với dịch vụ...',
            rating: 5,
            createdAt: '2025-10-10T15:11:08.078Z',
          },
        ],
        total: 10,
        page: 1,
        limit: 1,
        totalPages: 10,
        hasNext: true,
        hasPrev: false,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi máy chủ nội bộ.',
    example: {
      success: false,
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi lấy danh sách phản hồi: Method not implemented.',
      data: null,
    },
  })
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.feedbackService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @Permissions('feedback.write')
  @ApiOperation({ summary: 'Cap nhat phan hoi admin' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Permissions('feedback.delete')
  @ApiOperation({ summary: 'Xoa phan hoi admin' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.remove(id);
  }
}
