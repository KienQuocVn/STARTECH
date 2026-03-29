import { Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MediaService } from './media.service';

type UploadedMediaFile = {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
};

function buildFileName(_: unknown, file: UploadedMediaFile, callback: (error: Error | null, filename: string) => void) {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
}

function fileFilter(_: unknown, file: UploadedMediaFile, callback: (error: Error | null, acceptFile: boolean) => void) {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(new Error('Chi cho phep upload hinh anh JPG, PNG, WEBP, GIF hoac SVG.'), false);
    return;
  }

  callback(null, true);
}

@ApiTags('Media')
@ApiBearerAuth()
@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'EDITOR', 'VIEWER')
  @Permissions('media.read')
  @ApiOperation({ summary: 'Lay danh sach media assets' })
  findAll() {
    return this.mediaService.findAll();
  }

  @Post('upload')
  @Roles('SUPER_ADMIN', 'EDITOR')
  @Permissions('media.write')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload media asset' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads',
        filename: buildFileName,
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter,
    }),
  )
  upload(@UploadedFile() file: UploadedMediaFile) {
    return this.mediaService.create(file);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @Permissions('media.write')
  @ApiOperation({ summary: 'Xoa media asset' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.remove(id);
  }
}
