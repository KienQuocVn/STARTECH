import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Lay danh sach san pham' })
  @ApiResponse({
    status: 200,
    description: 'Danh sach san pham duoc tra ve thanh cong.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @Get('cat/:catId')
  @ApiOperation({ summary: 'Lay danh sach san pham theo danh muc' })
  @ApiResponse({
    status: 200,
    description: 'Danh sach san pham theo danh muc duoc tra ve thanh cong.',
  })
  findByCategory(@Param('catId', ParseIntPipe) catId: number, @Query() paginationDto: PaginationDto) {
    return this.productService.findByCategory(catId, paginationDto);
  }

  @Get('search/:keyword')
  @ApiOperation({ summary: 'Tim kiem san pham theo tu khoa' })
  @ApiResponse({
    status: 200,
    description: 'Danh sach san pham tim kiem duoc tra ve thanh cong.',
  })
  search(@Param('keyword') keyword: string, @Query() paginationDto: PaginationDto) {
    return this.productService.search(keyword, paginationDto);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lay thong tin san pham theo slug' })
  @ApiResponse({
    status: 200,
    description: 'Thong tin san pham duoc tra ve thanh cong theo slug.',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lay thong tin san pham theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thong tin san pham duoc tra ve thanh cong.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Tao san pham admin' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Cap nhat san pham admin' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Xoa san pham admin' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
