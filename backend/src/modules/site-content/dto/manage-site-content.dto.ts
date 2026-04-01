import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEnum, IsInt, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ContentWorkflowStatus } from '@prisma/client';

export class CreateSitePageDto {
  @ApiProperty({ example: 'home' })
  @IsString()
  @MaxLength(191)
  slug: string;

  @ApiProperty({ example: 'Trang chu' })
  @IsString()
  @MaxLength(191)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroBadge?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroDescription?: string;
}

export class UpdateSitePageDto extends PartialType(CreateSitePageDto) {}

export class ReviewSitePageDto {
  @ApiPropertyOptional({ enum: ContentWorkflowStatus, example: ContentWorkflowStatus.IN_REVIEW })
  @IsOptional()
  @IsEnum(ContentWorkflowStatus)
  status?: ContentWorkflowStatus;

  @ApiPropertyOptional({ example: 'Noi dung da san sang de review.' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpsertPageSectionDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @ApiProperty({ example: 'home-hero' })
  @IsString()
  @MaxLength(100)
  sectionKey: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryButtonLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryButtonHref?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondaryButtonLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondaryButtonHref?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  contentJson?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}

export class UpsertFaqItemDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @ApiProperty({ example: 'STARTECH cung cap dich vu gi?' })
  @IsString()
  question: string;

  @ApiProperty({ example: 'Thiet ke website, ecommerce va marketing.' })
  @IsString()
  answer: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
