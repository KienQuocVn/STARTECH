import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        {
          id: 1,
          product_cat_id: 4,
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
        },
        {
          id: 2,
          product_cat_id: 4,
          name: 'Product 2',
          description: 'Description 2',
          price: 200,
        },
      ];
      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts as any);
      (prisma.product.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Lấy danh sách sản phẩm thành công.');
      expect(result.data).toHaveProperty('items');
      expect(result.data!.items).toHaveLength(2);
      expect(result.data!.total).toBe(2);
      expect(result.data!.page).toBe(1);
      expect(result.data!.limit).toBe(10);
      expect(result.data!.totalPages).toBe(1);
      expect(result.data!.hasNext).toBe(false);
      expect(result.data!.hasPrev).toBe(false);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
      });
      expect(prisma.product.count).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
      (prisma.product.count as jest.Mock).mockResolvedValue(0);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe('Đã xảy ra lỗi khi lấy danh sách sản phẩm.');
      expect(result.data).toBeNull();

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return product details if product exists', async () => {
      const mockProduct = {
        id: 1,
        product_cat_id: 4,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
      };
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce(mockProduct as any);
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce(mockProduct as any);

      const result = await service.findOne(1);
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Lấy thông tin sản phẩm thành công.');
      expect(result.data).toEqual(mockProduct);

      expect(prisma.product.findUnique).toHaveBeenNthCalledWith(1, {
        where: { id: 1 },
      });
    });

    it('should return not found if product does not exist', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.findOne(9999999);
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.message).toBe('Sản phẩm không tồn tại.');
      expect(result.data).toBeNull();

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 9999999 },
      });
    });

    it('should handle errors gracefully', async () => {
      (prisma.product.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));
      const result = await service.findOne(1);
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe('Đã xảy ra lỗi khi lấy thông tin sản phẩm.');
      expect(result.data).toBeNull();

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
