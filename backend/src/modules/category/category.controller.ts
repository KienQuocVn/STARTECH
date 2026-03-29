import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Lấy danh mục sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Danh mục sản phẩm được lấy thành công.',
    example: {
      success: true,
      statusCode: 200,
      message: 'Lấy danh mục sản phẩm thành công',
      data: [
        {
          id: 1,
          name: 'Điện thoại',
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Lỗi máy chủ nội bộ.',
    example: {
      success: false,
      statusCode: 500,
      message: 'Đã xảy ra lỗi khi lấy danh mục sản phẩm',
      data: null,
    },
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Tao danh muc admin' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Cap nhat danh muc admin' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Xoa danh muc admin' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
