import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteSettingsService } from './site-settings.service';

@ApiTags('Site Settings')
@Controller('site-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'EDITOR', 'VIEWER')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  @Permissions('settings.read')
  @ApiOperation({ summary: 'Lay site settings cho admin' })
  findAll() {
    return this.siteSettingsService.findAll();
  }

  @Put()
  @Roles('SUPER_ADMIN', 'EDITOR')
  @Permissions('settings.write')
  @ApiOperation({ summary: 'Cap nhat site settings cho admin' })
  update(@Body() dto: UpdateSiteSettingsDto) {
    return this.siteSettingsService.update(dto);
  }
}
