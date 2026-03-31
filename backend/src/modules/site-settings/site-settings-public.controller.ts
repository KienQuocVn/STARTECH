import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';

@ApiTags('Public Site Settings')
@Controller('site-settings/public')
export class SiteSettingsPublicController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy site settings public cho frontend' })
  findPublic() {
    return this.siteSettingsService.findPublic();
  }
}
