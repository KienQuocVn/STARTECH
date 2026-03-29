import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Doanh nghiep' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  name: string;
}
