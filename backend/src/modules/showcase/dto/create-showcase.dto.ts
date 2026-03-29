import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class CreateShowcaseDto {
  @ApiProperty({ example: '/img/sample.webp' })
  @IsString()
  @MaxLength(255)
  image_url: string;

  @ApiProperty({ example: 'Website showcase STARTECH' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Mo ta ngan cho showcase.' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'website_url phai la URL hop le' })
  website_url?: string | null;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  display_order?: number;
}
