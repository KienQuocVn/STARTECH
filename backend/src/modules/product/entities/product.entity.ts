import { ApiProperty } from '@nestjs/swagger';
import { PriceType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class Product {
  @ApiProperty({ example: 1, description: 'ID sản phẩm' })
  id: number;

  @ApiProperty({ example: 'Sản phẩm A', description: 'Tên sản phẩm' })
  name: string;

  @ApiProperty({ example: 100000, description: 'Giá sản phẩm' })
  price: Decimal | null;

  @ApiProperty({ example: 'FIXED', description: 'Loại giá sản phẩm' })
  price_Type: PriceType;

  @ApiProperty({ example: 4, description: 'Đánh giá sản phẩm' })
  rating: Decimal | null;

  @ApiProperty({ example: 100, description: 'Số lượt thích sản phẩm' })
  like: number | null;

  @ApiProperty({ example: 50, description: 'Thời gian hoàn thành sản phẩm (ngày)' })
  completion_time: string | null;

  @ApiProperty({
    example: 'Mô tả sản phẩm',
    description: 'Mô tả sản phẩm',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 'https://example.com/images/product-a.jpg',
    description: 'URL hình ảnh sản phẩm',
  })
  image_url: string | null;

  @ApiProperty({
    example: 'https://example.com/demo/product-a',
    description: 'URL demo sản phẩm',
    nullable: true,
  })
  demo_url: string | null;

  @ApiProperty({
    example: new Date(),
    description: 'Thời gian tạo sản phẩm',
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Thời gian cập nhật sản phẩm',
  })
  updatedAt: Date;
}
