import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreatePricingPlanDto {
  @ApiProperty({ example: 'Goi chuyen nghiep' })
  @IsString()
  @MaxLength(191)
  name: string;

  @ApiPropertyOptional({ example: 25000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number | null;

  @ApiProperty({ enum: ['FIXED', 'CONTACT'], default: 'FIXED' })
  @IsIn(['FIXED', 'CONTACT'])
  price_Type: 'FIXED' | 'CONTACT';

  @ApiPropertyOptional({ example: 'Goi danh cho doanh nghiep can website chuyen nghiep.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  featureIds?: number[];
}
