import { PriceType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Test, TestingModule } from '@nestjs/testing';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: {
    product: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: BusinessEventsService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns paginated products with normalized fields', async () => {
      prisma.product.findMany.mockResolvedValue([
        {
          id: 1,
          slug: 'product-1',
          name: 'Product 1',
          description: 'Description 1',
          price: new Decimal(100),
          price_Type: PriceType.FIXED,
          rating: new Decimal(4.5),
          like: 10,
          completion_time: '30',
          image_url: 'http://example.com/image1.jpg',
          demo_url: 'http://example.com/demo1',
          product_category: [],
          product_service: [],
        },
      ]);
      prisma.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data?.items[0]).toEqual(
        expect.objectContaining({
          slug: 'product-1',
          rating: 4.5,
          price: '100',
        }),
      );
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
          include: expect.any(Object),
        }),
      );
    });

    it('handles data access errors gracefully', async () => {
      prisma.product.findMany.mockRejectedValue(new Error('Database error'));
      prisma.product.count.mockResolvedValue(0);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.data).toBeNull();
    });
  });

  describe('findOne', () => {
    it('returns product details when found', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 1,
        slug: 'product-1',
        name: 'Product 1',
        description: 'Description 1',
        price: new Decimal(100),
        price_Type: PriceType.FIXED,
        rating: new Decimal(4.5),
        like: 10,
        completion_time: '30',
        image_url: 'http://example.com/image1.jpg',
        demo_url: 'http://example.com/demo1',
        product_category: [],
        product_service: [],
        images: [],
      });

      const result = await service.findOne(1);

      expect(result.success).toBe(true);
      expect(result.data?.slug).toBe('product-1');
      expect(prisma.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          include: expect.any(Object),
        }),
      );
    });

    it('returns not found response when product is missing', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      const result = await service.findOne(9999999);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.data).toBeNull();
    });
  });
});
