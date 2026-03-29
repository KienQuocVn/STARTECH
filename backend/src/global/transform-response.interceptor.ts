import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<{ statusCode: number; status: (code: number) => void }>();

    return next.handle().pipe(
      map((data) => {
        if (
          data !== null &&
          typeof data === 'object' &&
          'success' in data &&
          'statusCode' in data &&
          'message' in data
        ) {
          const typedData = data as ApiResponse<T>;
          if (typeof typedData.statusCode === 'number') {
            response.status(typedData.statusCode);
          }
          return typedData;
        }

        const statusCode = typeof response.statusCode === 'number' ? response.statusCode : 200;

        return {
          success: true,
          statusCode,
          message: 'Thanh cong',
          data,
        };
      }),
    );
  }
}
