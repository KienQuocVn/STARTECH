import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { StatusCodes } from 'http-status-codes';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const items = await (this.prisma as any).mediaAsset.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lay danh sach media thanh cong.',
      data: items,
    };
  }

  async create(file: { filename: string; originalname: string; mimetype: string; size: number; path: string }) {
    const publicUrl = `/uploads/${file.filename}`;
    const item = await (this.prisma as any).mediaAsset.create({
      data: {
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storagePath: file.path,
        publicUrl,
      },
    });

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Upload media thanh cong.',
      data: item,
    };
  }

  async remove(id: number) {
    const item = await (this.prisma as any).mediaAsset.findUnique({
      where: { id },
    });

    if (item?.storagePath) {
      await fs.unlink(join(item.storagePath)).catch(() => null);
    }

    await (this.prisma as any).mediaAsset.delete({
      where: { id },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa media thanh cong.',
      data: { id },
    };
  }
}
