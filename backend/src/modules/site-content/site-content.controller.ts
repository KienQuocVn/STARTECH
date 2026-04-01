import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SiteContentService } from './site-content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Permissions } from '../auth/permissions.decorator';
import {
  CreateSitePageDto,
  ReviewSitePageDto,
  UpdateSitePageDto,
  UpsertFaqItemDto,
  UpsertPageSectionDto,
} from './dto/manage-site-content.dto';

@ApiTags('Site Content')
@Controller('site-content')
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get('page/:slug')
  @ApiOperation({ summary: 'Lay noi dung dong theo slug trang' })
  @ApiResponse({ status: 200, description: 'Lay noi dung trang thanh cong.' })
  findPageBySlug(@Param('slug') slug: string) {
    return this.siteContentService.findPageBySlug(slug);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR', 'VIEWER')
  @Permissions('content.read')
  @ApiOperation({ summary: 'Lay tat ca page content cho admin' })
  findAllPages() {
    return this.siteContentService.findAllPages();
  }

  @Post('page')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @Permissions('content.write')
  @ApiOperation({ summary: 'Tao page content admin' })
  createPage(@Body() createSitePageDto: CreateSitePageDto) {
    return this.siteContentService.createPage(createSitePageDto);
  }

  @Patch('page/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @Permissions('content.write')
  @ApiOperation({ summary: 'Cap nhat page content admin' })
  updatePage(@Param('id', ParseIntPipe) id: number, @Body() updateSitePageDto: UpdateSitePageDto) {
    return this.siteContentService.updatePage(id, updateSitePageDto);
  }

  @Delete('page/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Permissions('content.delete')
  @ApiOperation({ summary: 'Xoa page content admin' })
  removePage(@Param('id', ParseIntPipe) id: number) {
    return this.siteContentService.removePage(id);
  }

  @Post('page/:pageId/section')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @Permissions('content.write')
  @ApiOperation({ summary: 'Tao/cap nhat section admin' })
  upsertSection(@Param('pageId', ParseIntPipe) pageId: number, @Body() dto: UpsertPageSectionDto) {
    return this.siteContentService.upsertSection(pageId, dto);
  }

  @Delete('section/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Permissions('content.delete')
  @ApiOperation({ summary: 'Xoa section admin' })
  removeSection(@Param('id', ParseIntPipe) id: number) {
    return this.siteContentService.removeSection(id);
  }

  @Post('page/:pageId/faq')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @Permissions('content.write')
  @ApiOperation({ summary: 'Tao/cap nhat FAQ admin' })
  upsertFaq(@Param('pageId', ParseIntPipe) pageId: number, @Body() dto: UpsertFaqItemDto) {
    return this.siteContentService.upsertFaq(pageId, dto);
  }

  @Delete('faq/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Permissions('content.delete')
  @ApiOperation({ summary: 'Xoa FAQ admin' })
  removeFaq(@Param('id', ParseIntPipe) id: number) {
    return this.siteContentService.removeFaq(id);
  }

  @Post('page/:id/submit-review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @Permissions('content.write')
  @ApiOperation({ summary: 'Gui page vao quy trinh review' })
  submitPageForReview(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewSitePageDto) {
    return this.siteContentService.submitPageForReview(id, dto);
  }

  @Post('page/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Permissions('content.write')
  @ApiOperation({ summary: 'Phe duyet page content' })
  approvePage(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewSitePageDto) {
    return this.siteContentService.approvePage(id, dto);
  }

  @Post('page/:id/request-changes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Permissions('content.write')
  @ApiOperation({ summary: 'Yeu cau cap nhat lai noi dung page' })
  requestChanges(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewSitePageDto) {
    return this.siteContentService.requestChanges(id, dto);
  }

  @Post('page/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Permissions('content.write')
  @ApiOperation({ summary: 'Publish page content len public site' })
  publishPage(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewSitePageDto) {
    return this.siteContentService.publishPage(id, dto);
  }
}
