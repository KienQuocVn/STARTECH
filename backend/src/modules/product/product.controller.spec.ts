import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Decimal } from '@prisma/client/runtime/library';
import { PriceType } from '@prisma/client';

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
    it('should return an array of products', async () => {
      const mockQuery = { page: 1, limit: 10 };
      const mockedResult = {
        success: true,
        statusCode: 200,
        message: 'Lấy danh sách sản phẩm thành công.',
        data: {
          items: [
            {
              id: 1,
              product_cat_id: 4,
              name: 'Product 1',
              description: 'Description 1',
              price: '100',
              price_Type: PriceType.FIXED,
              rating: new Decimal(4.5),
              like: 10,
              completion_time: '30',
              image_url: 'http://example.com/image1.jpg',
              demo_url: 'http://example.com/demo1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 2,
              product_cat_id: 4,
              name: 'Product 2',
              description: 'Description 2',
              price: 'Liên hệ',
              price_Type: PriceType.CONTACT,
              rating: new Decimal(4.0),
              like: 5,
              completion_time: '15',
              image_url: 'http://example.com/image2.jpg',
              demo_url: 'http://example.com/demo2',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          total: 2,
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
      expect(result.message).toBe('Lấy danh sách sản phẩm thành công.');

      expect(result.data).toHaveProperty('items');
      expect(result.data).toBeTruthy();
      expect(Array.isArray(result.data!.items)).toBe(true);
      expect(result.data).toHaveProperty('page', 1);
      expect(result.data).toHaveProperty('limit', 10);

      expect(service.findAll).toHaveBeenCalledWith(mockQuery);
    });

    it('should call service.findAll with default params if no query', async () => {
      const mockResponse = {
        success: true,
        statusCode: 200,
        message: 'Lấy danh sách sản phẩm thành công.',
        data: {
          items: [],
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      service.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll({});
      expect(result.statusCode).toBe(200);
      expect(result.message).toContain('Lấy danh sách sản phẩm');

      expect(service.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockId = 1;
      const mockedResult = {
        success: true,
        statusCode: 200,
        message: 'Lấy thông tin sản phẩm thành công.',
        data: {
          id: 1,
          price: '100',
          rating: new Decimal(4.5),
          like: 10,
          completion_time: '30',
          demo_url: 'http://example.com/demo1',
          name: 'Product 1',
          image_url: 'http://example.com/image1.jpg',
          description: 'Description 1',
        },
      };
      service.findOne.mockResolvedValue(mockedResult);

      const result = await controller.findOne(mockId);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Lấy thông tin sản phẩm thành công.');
      expect(result.data).toBeTruthy();
      expect(result.data).toHaveProperty('id', 1);

      expect(service.findOne).toHaveBeenCalledWith(mockId);
    });

    it('should throw an error if product not found', async () => {
      const mockId = 999999999;

      service.findOne.mockResolvedValue({
        success: false,
        statusCode: 404,
        message: 'Sản phẩm không tồn tại.',
        data: null,
      });

      const result = await controller.findOne(mockId);

      expect(service.findOne).toHaveBeenCalledWith(mockId);
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.message).toBe('Sản phẩm không tồn tại.');
      expect(result.data).toBeNull();
    });

    it('should return 500 if internal error occurs', async () => {
      const mockId = 123;

      service.findOne.mockResolvedValue({
        success: false,
        statusCode: 500,
        message: 'Đã xảy ra lỗi khi lấy thông tin sản phẩm.',
        data: null,
      });

      const result = await controller.findOne(mockId);

      expect(service.findOne).toHaveBeenCalledWith(mockId);
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe('Đã xảy ra lỗi khi lấy thông tin sản phẩm.');
    });
  });
});
