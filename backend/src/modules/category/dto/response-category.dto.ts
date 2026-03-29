import { Expose, Type } from 'class-transformer';
import { ApiResponse } from '../../../shared/dto/api-response.dto';

export class CategoryData {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class CategoryCount {
  @Expose()
  product_count: number;
}

export class CategoryWithCount extends CategoryData {
  @Expose()
  @Type(() => CategoryCount)
  product_count: CategoryCount;
}

export class ResponseCategoryDto extends ApiResponse {
  @Expose()
  @Type(() => CategoryWithCount)
  data: CategoryWithCount[];
}
