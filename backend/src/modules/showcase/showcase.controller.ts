import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ShowcaseService } from './showcase.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Permissions } from '../auth/permissions.decorator';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

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
  @Permissions('showcase.write')
  @ApiOperation({ summary: 'Tao showcase admin' })
  create(@Req() request: AuthenticatedRequest, @Body() createShowcaseDto: CreateShowcaseDto) {
    return this.showcaseService.create(createShowcaseDto, request.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @Permissions('showcase.write')
  @ApiOperation({ summary: 'Cap nhat showcase admin' })
  update(@Req() request: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number, @Body() updateShowcaseDto: UpdateShowcaseDto) {
    return this.showcaseService.update(id, updateShowcaseDto, request.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Permissions('showcase.delete')
  @ApiOperation({ summary: 'Xoa showcase admin' })
  remove(@Req() request: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.showcaseService.remove(id, request.user);
  }
}
