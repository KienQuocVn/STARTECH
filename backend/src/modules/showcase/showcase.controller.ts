import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ShowcaseService } from './showcase.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Showcase')
@Controller('showcase')
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) {}

  @Get()
  @ApiOperation({ summary: 'Lay danh sach website showcase o trang chu' })
  @ApiResponse({ status: 200, description: 'Lay danh sach showcase thanh cong.' })
  findAll() {
    return this.showcaseService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Tao showcase admin' })
  create(@Body() createShowcaseDto: CreateShowcaseDto) {
    return this.showcaseService.create(createShowcaseDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Cap nhat showcase admin' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateShowcaseDto: UpdateShowcaseDto) {
    return this.showcaseService.update(id, updateShowcaseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Xoa showcase admin' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.showcaseService.remove(id);
  }
}
