import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { appConfiguration } from './config/configuration';
import { winstonLogger } from './config/logger.config';
import { GlobalHttpExceptionFilter } from './global/http-exception.filter';
import { TransformResponseInterceptor } from './global/transform-response.interceptor';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });
  const { corsOrigins, isProduction, port, swagger } = appConfiguration;
  const uploadsDir = join(process.cwd(), 'uploads');

  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.use(helmet());
  app.use(compression());
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });

  const config = new DocumentBuilder()
    .setTitle('STARTECH API')
    .setDescription('API documentation cho website dich vu thiet ke website STARTECH')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Site Content', 'Nội dung động theo trang')
    .addTag('Auth', 'Đăng nhập và quản lý tài khoản')
    .addTag('Product', 'Dự án / portfolio')
    .addTag('Category', 'Danh mục dự án')
    .addTag('Services', 'Dịch vụ')
    .addTag('Pricing Plan', 'Gói giá')
    .addTag('Feedback', 'Đánh giá khách hàng')
    .addTag('Showcase', 'Showcase trang chủ')
    .addTag('Contact', 'Form liên hệ')
    .addTag('Media', 'Upload và quản lý tài nguyên')
    .addTag('Health', 'Health check')
    .build();

  const canServeSwagger = swagger.enabled && (!isProduction || swagger.allowInProduction);

  if (canServeSwagger) {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swagger.path, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  console.log(`Server running at http://localhost:${port}`);
  if (canServeSwagger) {
    console.log(`Swagger docs at http://localhost:${port}/${swagger.path}`);
  }
  console.log(`API base at http://localhost:${port}/api/v1`);
  console.log(`Health check at http://localhost:${port}/health`);
}

void bootstrap();
