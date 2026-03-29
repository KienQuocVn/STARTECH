import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Thiet ke website' })
  @IsString()
  @MaxLength(191)
  name: string;
}
