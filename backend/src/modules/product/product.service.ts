import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { ApiPaginatedResponse, PaginationDto } from '../../shared/dto/pagination.dto';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDetailResponse, ProductResponse } from './dto/response-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private readonly businessEvents: BusinessEventsService,
  ) {}

  private readonly listProductInclude = {
    product_category: {
      select: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    product_service: {
      select: {
        id: true,
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  } as const;

  private readonly detailProductInclude = {
    ...this.listProductInclude,
    images: {
      select: {
        id: true,
        url: true,
      },
    },
  } as const;

  private buildSlug(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private formatProduct(product: any) {
    return {
      ...product,
      slug: product.slug ?? this.buildSlug(product.name),
      rating: Number(product.rating),
      price: product.price_Type === 'FIXED' && product.price ? product.price.toFixed(0) : 'Liên hệ',
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<ApiPaginatedResponse<ProductResponse>> {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          skip,
          take: limit,
          orderBy: { id: 'asc' },
          include: this.listProductInclude,
        }),
        this.prisma.product.count(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Lay danh sach san pham thanh cong.',
        data: {
          items: products.map((product) => this.formatProduct(product)),
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Da xay ra loi khi lay danh sach san pham.',
        data: null,
      };
    }
  }

  async findOne(id: number): Promise<ProductDetailResponse> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: this.detailProductInclude,
      });

      if (!product) {
        return {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'San pham khong ton tai.',
          data: null,
        };
      }

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Lay thong tin san pham thanh cong.',
        data: this.formatProduct(product),
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Da xay ra loi khi lay thong tin san pham.',
        data: null,
      };
    }
  }

  async findBySlug(slug: string): Promise<ProductDetailResponse> {
    try {
      const product = await (this.prisma.product as any).findFirst({
        where: { slug },
        include: this.detailProductInclude,
      });

      if (!product) {
        return {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'San pham khong ton tai.',
          data: null,
        };
      }

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Lay thong tin san pham thanh cong.',
        data: this.formatProduct(product),
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Da xay ra loi khi lay thong tin san pham theo slug.',
        data: null,
      };
    }
  }

  async findByCategory(categoryId: number, paginationDto: PaginationDto): Promise<ApiPaginatedResponse<ProductResponse>> {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      const where = {
        product_category: { some: { category_id: categoryId } },
      };

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { id: 'asc' },
          include: this.listProductInclude,
        }),
        this.prisma.product.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Lay danh sach san pham theo danh muc thanh cong.',
        data: {
          items: products.map((product) => this.formatProduct(product)),
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Da xay ra loi khi lay danh sach san pham theo danh muc.',
        data: null,
      };
    }
  }

  async search(keyword: string, paginationDto: PaginationDto): Promise<ApiPaginatedResponse<ProductResponse>> {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      const where = {
        OR: [{ name: { search: keyword } }, { description: { search: keyword } }],
      };

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            _relevance: {
              fields: ['name', 'description'],
              search: keyword,
              sort: 'desc',
            },
          },
          include: this.listProductInclude,
        }),
        this.prisma.product.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Tim kiem san pham thanh cong.',
        data: {
          items: products.map((product) => this.formatProduct(product)),
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Da xay ra loi khi tim kiem san pham.',
        data: null,
      };
    }
  }

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        slug: createProductDto.slug || this.buildSlug(createProductDto.name),
        name: createProductDto.name,
        price: createProductDto.price != null ? new Prisma.Decimal(createProductDto.price) : null,
        price_Type: createProductDto.price_Type || 'CONTACT',
        rating: new Prisma.Decimal(createProductDto.rating ?? 0),
        like: createProductDto.like ?? 0,
        completion_time: createProductDto.completion_time ?? null,
        description: createProductDto.description,
        image_url: createProductDto.image_url,
        demo_url: createProductDto.demo_url ?? null,
        product_category: createProductDto.categoryIds?.length
          ? {
              create: createProductDto.categoryIds.map((categoryId) => ({
                category: {
                  connect: { id: categoryId },
                },
              })),
            }
          : undefined,
        product_service: createProductDto.serviceIds?.length
          ? {
              create: createProductDto.serviceIds.map((serviceId) => ({
                service: {
                  connect: { id: serviceId },
                },
              })),
            }
          : undefined,
        images: createProductDto.imageUrls?.length
          ? {
              create: createProductDto.imageUrls.map((url) => ({ url })),
            }
          : undefined,
      },
      include: this.detailProductInclude,
    });

    this.businessEvents.log({
      entity: 'product',
      action: 'product.create',
      entityId: product.id,
      metadata: {
        slug: product.slug,
        name: product.name,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Tao san pham thanh cong.',
      data: this.formatProduct(product),
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        slug:
          updateProductDto.slug !== undefined ? updateProductDto.slug || this.buildSlug(updateProductDto.name || existing?.name || '') : undefined,
        name: updateProductDto.name,
        price:
          updateProductDto.price !== undefined ? (updateProductDto.price != null ? new Prisma.Decimal(updateProductDto.price) : null) : undefined,
        price_Type: updateProductDto.price_Type,
        rating: updateProductDto.rating !== undefined ? new Prisma.Decimal(updateProductDto.rating) : undefined,
        like: updateProductDto.like,
        completion_time: updateProductDto.completion_time,
        description: updateProductDto.description,
        image_url: updateProductDto.image_url,
        demo_url: updateProductDto.demo_url,
        product_category: updateProductDto.categoryIds
          ? {
              deleteMany: {},
              create: updateProductDto.categoryIds.map((categoryId) => ({
                category: {
                  connect: { id: categoryId },
                },
              })),
            }
          : undefined,
        product_service: updateProductDto.serviceIds
          ? {
              deleteMany: {},
              create: updateProductDto.serviceIds.map((serviceId) => ({
                service: {
                  connect: { id: serviceId },
                },
              })),
            }
          : undefined,
        images: updateProductDto.imageUrls
          ? {
              deleteMany: {},
              create: updateProductDto.imageUrls.map((url) => ({ url })),
            }
          : undefined,
      },
      include: this.detailProductInclude,
    });

    this.businessEvents.log({
      entity: 'product',
      action: 'product.update',
      entityId: product.id,
      metadata: {
        slug: product.slug,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cap nhat san pham thanh cong.',
      data: this.formatProduct(product),
    };
  }

  async remove(id: number) {
    await this.prisma.product.delete({
      where: { id },
    });

    this.businessEvents.log({
      entity: 'product',
      action: 'product.delete',
      entityId: id,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa san pham thanh cong.',
      data: { id },
    };
  }
}
