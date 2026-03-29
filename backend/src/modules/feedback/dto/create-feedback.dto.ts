import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength, Min, Max, IsNumber } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên của người phản hồi',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'Tôi rất hài lòng với dịch vụ...',
    description: 'Nội dung phản hồi',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  comment: string;

  @ApiProperty({
    example: 5,
    description: 'Đánh giá của người phản hồi',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  rating: number;
}
