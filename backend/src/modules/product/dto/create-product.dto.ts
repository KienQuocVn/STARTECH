import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @ApiPropertyOptional({ example: 'website-thuong-hieu-startech' })
  @IsOptional()
  @IsString()
  @MaxLength(191)
  slug?: string;

  @ApiProperty({ example: 'Website thuong hieu STARTECH' })
  @IsString()
  @MaxLength(191)
  name: string;

  @ApiPropertyOptional({ enum: ['FIXED', 'CONTACT'], default: 'CONTACT' })
  @IsOptional()
  @IsIn(['FIXED', 'CONTACT'])
  price_Type?: 'FIXED' | 'CONTACT';

  @ApiPropertyOptional({ example: 15000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number | null;

  @ApiPropertyOptional({ example: 4.8 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rating?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  like?: number;

  @ApiPropertyOptional({ example: '3 - 4 tuan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  completion_time?: string;

  @ApiProperty({ example: 'Mo ta ngan cho du an portfolio.' })
  @IsString()
  description: string;

  @ApiProperty({ example: '/product/project1.webp' })
  @IsString()
  @MaxLength(255)
  image_url: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'demo_url phai la URL hop le' })
  demo_url?: string | null;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  categoryIds?: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  serviceIds?: number[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
