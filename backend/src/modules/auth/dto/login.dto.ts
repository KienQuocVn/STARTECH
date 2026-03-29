import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@startech.local' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Startech@2026' })
  @IsString()
  @MinLength(8)
  password: string;
}
