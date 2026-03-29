import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { ApiResponse } from './api-response.dto';
import { Expose, Type } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Số trang',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là một số nguyên.' })
  @IsOptional()
  @IsPositive({ message: 'Số trang phải là một số nguyên dương.' })
  @Min(1, { message: 'Số trang phải lớn hơn hoặc bằng 1.' })
  page?: number;

  @ApiPropertyOptional({
    description: 'Số lượng sản phẩm trên mỗi trang',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @IsInt({ message: 'Số lượng sản phẩm phải là một số nguyên.' })
  @IsOptional()
  @IsPositive({ message: 'Số lượng sản phẩm phải là một số nguyên dương.' })
  @Min(1, { message: 'Số lượng sản phẩm phải lớn hơn hoặc bằng 1.' })
  @Max(100, { message: 'Số lượng sản phẩm không được vượt quá 100.' })
  limit?: number;
}

export class ApiPaginatedResponse<T> extends ApiResponse {
  @Expose()
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
}
