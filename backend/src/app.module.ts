import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ContactModule } from './modules/contact/contact.module';
import { MailModule } from './shared/mail/mail.module';
import { GoogleSheetsModule } from './shared/google-sheet/google-sheet.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProductModule } from './modules/product/product.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { CategoryModule } from './modules/category/category.module';
import { PricingPlanModule } from './modules/pricing-plan/pricing_plan.module';
import { ServicesModule } from './modules/services/services.module';
import { ShowcaseModule } from './modules/showcase/showcase.module';
import { SiteContentModule } from './modules/site-content/site-content.module';
import { AuthModule } from './modules/auth/auth.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [
    // Config toàn cục
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting — 100 req / 60s mỗi IP mặc định, contact endpoint sẽ override
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,  // 60 giây
        limit: 100,
      },
      {
        name: 'strict',
        ttl: 60_000,
        limit: 10,   // Dùng cho contact form, auth endpoints
      },
    ]),

    // Domain modules
    ContactModule,
    MailModule,
    ProductModule,
    CategoryModule,
    ServicesModule,
    PricingPlanModule,
    FeedbackModule,
    ShowcaseModule,
    SiteContentModule,
    AuthModule,
    MediaModule,
    GoogleSheetsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Áp dụng ThrottlerGuard toàn cục — endpoint cụ thể có thể dùng @SkipThrottle hoặc @Throttle override
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
