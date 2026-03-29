/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { winstonLogger } from './config/logger.config';
import { GlobalHttpExceptionFilter } from './global/http-exception.filter';
import { TransformResponseInterceptor } from './global/transform-response.interceptor';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });
  const uploadsDir = join(process.cwd(), 'uploads');

  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
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
    .addTag('Site Content', 'Noi dung dong theo trang')
    .addTag('Auth', 'Dang nhap quan tri va xac thuc')
    .addTag('Product', 'Du an / portfolio')
    .addTag('Category', 'Danh muc du an')
    .addTag('Services', 'Dich vu')
    .addTag('Pricing Plan', 'Goi gia')
    .addTag('Feedback', 'Danh gia khach hang')
    .addTag('Showcase', 'Showcase trang chu')
    .addTag('Contact', 'Form lien he')
    .addTag('Media', 'Upload va quan ly tai nguyen')
    .addTag('Health', 'Health check')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
  console.log(`API base at http://localhost:${port}/api/v1`);
  console.log(`Health check at http://localhost:${port}/health`);
}

void bootstrap();
