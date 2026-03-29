import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên của người liên hệ',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'Công ty ABC',
    description: 'Tên của công ty (nếu có)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  company?: string;

  @ApiProperty({
    example: 'nguyenvana@gmail.com',
    description: 'Email của người liên hệ',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại của người liên hệ',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10,15}$/, { message: 'Phone must be 10-15 digits only' })
  phone: string;

  @ApiProperty({
    example: 'Dịch vụ A',
    description: 'Dịch vụ mà người liên hệ quan tâm',
    required: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  service?: string;

  @ApiProperty({
    example: 'Tôi muốn biết thêm về dịch vụ A...',
    description: 'Nội dung tin nhắn',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  message: string;
}
