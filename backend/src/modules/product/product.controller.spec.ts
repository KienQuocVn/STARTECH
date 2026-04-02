import { PriceType } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let service: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findBySlug: jest.fn(),
            findByCategory: jest.fn(),
            search: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('returns paginated product payload', async () => {
      const mockQuery = { page: 1, limit: 10 };
      const mockedResult = {
        success: true,
        statusCode: 200,
        message: 'Lay danh sach san pham thanh cong.',
        data: {
          items: [
            {
              id: 1,
              slug: 'product-1',
              name: 'Product 1',
              description: 'Description 1',
              price: '100',
              price_Type: PriceType.FIXED,
              rating: 4.5,
              like: 10,
              completion_time: '30',
              image_url: 'http://example.com/image1.jpg',
              demo_url: 'http://example.com/demo1',
              product_category: [],
              product_service: [],
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
      service.findAll.mockResolvedValue(mockedResult);

      const result = await controller.findAll(mockQuery);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data?.items).toHaveLength(1);
      expect(service.findAll).toHaveBeenCalledWith(mockQuery);
    });
  });

  describe('findOne', () => {
    it('returns single product payload', async () => {
      const mockedResult = {
        success: true,
        statusCode: 200,
        message: 'Lay thong tin san pham thanh cong.',
        data: {
          id: 1,
          slug: 'product-1',
          name: 'Product 1',
              description: 'Description 1',
              price: '100',
              price_Type: PriceType.FIXED,
              rating: 4.5,
              like: 10,
          completion_time: '30',
          image_url: 'http://example.com/image1.jpg',
          demo_url: 'http://example.com/demo1',
          images: [],
          product_category: [],
          product_service: [],
        },
      };
      service.findOne.mockResolvedValue(mockedResult);

      const result = await controller.findOne(1);

      expect(result.success).toBe(true);
      expect(result.data?.slug).toBe('product-1');
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('returns not found payload when service misses product', async () => {
      service.findOne.mockResolvedValue({
        success: false,
        statusCode: 404,
        message: 'San pham khong ton tai.',
        data: null,
      });

      const result = await controller.findOne(999999999);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.data).toBeNull();
    });
  });
});
