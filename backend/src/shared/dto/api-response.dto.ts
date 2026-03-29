import { Expose } from 'class-transformer';

export class ApiResponse {
  @Expose()
  success: boolean;

  @Expose()
  statusCode: number;

  @Expose()
  message: string;
}
