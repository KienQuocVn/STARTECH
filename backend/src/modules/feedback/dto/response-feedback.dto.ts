import { Expose, Type } from 'class-transformer';
import { ApiResponse } from '../../../shared/dto/api-response.dto';
import { ApiPaginatedResponse } from '../../../shared/dto/pagination.dto';

export class FeedbackData {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  comment: string;

  @Expose()
  rating: number;

  @Expose()
  createdAt: Date;
}

export class ResponseCreateFeedbackDto extends ApiResponse {
  @Expose()
  @Type(() => FeedbackData)
  data: FeedbackData | null;
}

export class ResponseFeedbackPaginatedDto extends ApiPaginatedResponse<FeedbackData> {}
