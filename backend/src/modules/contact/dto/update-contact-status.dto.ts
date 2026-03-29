import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateContactStatusDto {
  @ApiProperty({ enum: ['WAITING', 'VIEWED', 'PROCESSED'] })
  @IsIn(['WAITING', 'VIEWED', 'PROCESSED'])
  status: 'WAITING' | 'VIEWED' | 'PROCESSED';
}
