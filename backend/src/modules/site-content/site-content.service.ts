import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCodes } from 'http-status-codes';
import {
  CreateSitePageDto,
  UpdateSitePageDto,
  UpsertFaqItemDto,
  UpsertPageSectionDto,
} from './dto/manage-site-content.dto';

@Injectable()
export class SiteContentService {
  private readonly logger = new Logger(SiteContentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findPageBySlug(slug: string) {
    try {
      const page = await this.prisma.sitePage.findFirst({
        where: {
          slug,
          deletedAt: null,
        },
        include: {
          sections: {
            where: {
              isActive: true,
              deletedAt: null,
            },
            orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
          },
          faqs: {
            where: {
              isActive: true,
              deletedAt: null,
            },
            orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
          },
        },
      });

      if (!page) {
        return {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Khong tim thay noi dung trang.',
          data: null,
        };
      }

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Lay noi dung trang thanh cong.',
        data: page,
      };
    } catch (error) {
      this.logger.error('Khong the lay noi dung trang.', error instanceof Error ? error.stack : String(error));
      return {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Da xay ra loi khi lay noi dung trang.',
        data: null,
      };
    }
  }

  async findAllPages() {
    const pages = await this.prisma.sitePage.findMany({
      where: { deletedAt: null },
      include: {
        sections: {
          where: { deletedAt: null },
          orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        },
        faqs: {
          where: { deletedAt: null },
          orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        },
      },
      orderBy: { id: 'asc' },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lay danh sach page content thanh cong.',
      data: pages,
    };
  }

  async createPage(createSitePageDto: CreateSitePageDto) {
    const page = await this.prisma.sitePage.create({
      data: createSitePageDto,
    });

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Tao page content thanh cong.',
      data: page,
    };
  }

  async updatePage(id: number, updateSitePageDto: UpdateSitePageDto) {
    const page = await this.prisma.sitePage.update({
      where: { id },
      data: updateSitePageDto,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cap nhat page content thanh cong.',
      data: page,
    };
  }

  async removePage(id: number) {
    await this.prisma.sitePage.delete({
      where: { id },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa page content thanh cong.',
      data: { id },
    };
  }

  async upsertSection(pageId: number, dto: UpsertPageSectionDto) {
    const section = dto.id
      ? await this.prisma.pageSection.update({
          where: { id: dto.id },
          data: {
            sectionKey: dto.sectionKey,
            title: dto.title,
            subtitle: dto.subtitle,
            description: dto.description,
            imageUrl: dto.imageUrl,
            primaryButtonLabel: dto.primaryButtonLabel,
            primaryButtonHref: dto.primaryButtonHref,
            secondaryButtonLabel: dto.secondaryButtonLabel,
            secondaryButtonHref: dto.secondaryButtonHref,
            contentJson: dto.contentJson as Prisma.InputJsonValue | undefined,
            displayOrder: dto.displayOrder ?? 0,
            isActive: dto.isActive ?? true,
          },
        })
      : await this.prisma.pageSection.create({
          data: {
            pageId,
            sectionKey: dto.sectionKey,
            title: dto.title,
            subtitle: dto.subtitle,
            description: dto.description,
            imageUrl: dto.imageUrl,
            primaryButtonLabel: dto.primaryButtonLabel,
            primaryButtonHref: dto.primaryButtonHref,
            secondaryButtonLabel: dto.secondaryButtonLabel,
            secondaryButtonHref: dto.secondaryButtonHref,
            contentJson: dto.contentJson as Prisma.InputJsonValue | undefined,
            displayOrder: dto.displayOrder ?? 0,
            isActive: dto.isActive ?? true,
          },
        });

    return {
      success: true,
      statusCode: dto.id ? StatusCodes.OK : StatusCodes.CREATED,
      message: 'Luu page section thanh cong.',
      data: section,
    };
  }

  async removeSection(id: number) {
    await this.prisma.pageSection.delete({
      where: { id },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa page section thanh cong.',
      data: { id },
    };
  }

  async upsertFaq(pageId: number, dto: UpsertFaqItemDto) {
    const faq = dto.id
      ? await this.prisma.faqItem.update({
          where: { id: dto.id },
          data: {
            question: dto.question,
            answer: dto.answer,
            displayOrder: dto.displayOrder ?? 0,
            isActive: dto.isActive ?? true,
          },
        })
      : await this.prisma.faqItem.create({
          data: {
            pageId,
            question: dto.question,
            answer: dto.answer,
            displayOrder: dto.displayOrder ?? 0,
            isActive: dto.isActive ?? true,
          },
        });

    return {
      success: true,
      statusCode: dto.id ? StatusCodes.OK : StatusCodes.CREATED,
      message: 'Luu FAQ thanh cong.',
      data: faq,
    };
  }

  async removeFaq(id: number) {
    await this.prisma.faqItem.delete({
      where: { id },
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa FAQ thanh cong.',
      data: { id },
    };
  }
}
