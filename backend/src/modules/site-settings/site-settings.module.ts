import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SiteSettingsController } from './site-settings.controller';
import { SiteSettingsPublicController } from './site-settings-public.controller';
import { SiteSettingsService } from './site-settings.service';

@Module({
  imports: [PrismaModule],
  controllers: [SiteSettingsController, SiteSettingsPublicController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
