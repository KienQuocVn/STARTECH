import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './modules/prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns connected health payload when database responds', async () => {
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const result = await appController.getHealth();

    expect(result.success).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.data.database).toBe('connected');
  });

  it('returns degraded health payload when database throws', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('db down'));

    const result = await appController.getHealth();

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(503);
    expect(result.data.database).toBe('disconnected');
    expect(result.data.error).toContain('db down');
  });
});
