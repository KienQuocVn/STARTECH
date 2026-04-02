import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ContentWorkflowStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCodes } from 'http-status-codes';
import {
  CreateSitePageDto,
  ReviewSitePageDto,
  UpdateSitePageDto,
  UpsertFaqItemDto,
  UpsertPageSectionDto,
} from './dto/manage-site-content.dto';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

type PageSnapshot = {
  id: number;
  slug: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  heroBadge: string | null;
  heroTitle: string | null;
  heroDescription: string | null;
  workflowStatus: ContentWorkflowStatus;
  publishedVersionId: number | null;
  submittedAt: Date | null;
  approvedAt: Date | null;
  publishedAt: Date | null;
  sections: Array<{
    id: number;
    sectionKey: string;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    imageUrl: string | null;
    primaryButtonLabel: string | null;
    primaryButtonHref: string | null;
    secondaryButtonLabel: string | null;
    secondaryButtonHref: string | null;
    contentJson: Prisma.JsonValue | null;
    displayOrder: number;
    isActive: boolean;
  }>;
  faqs: Array<{
    id: number;
    question: string;
    answer: string;
    displayOrder: number;
    isActive: boolean;
  }>;
};

@Injectable()
export class SiteContentService {
  private readonly logger = new Logger(SiteContentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly businessEvents: BusinessEventsService,
  ) {}

  private getActorIdentity(actor?: JwtPayload | null) {
    if (!actor) {
      return {
        actorId: null,
        actorRef: null,
        actorLabel: null,
        actorRole: null,
      };
    }

    return {
      actorId: actor.sub,
      actorRef: String(actor.sub),
      actorLabel: actor.email,
      actorRole: actor.role,
    };
  }

  private logContentEvent(
    payload: {
      entity: string;
      action: string;
      entityId?: number | string | null;
      metadata?: Record<string, unknown>;
    },
    actor?: JwtPayload | null,
  ) {
    const { actorId, actorLabel, actorRole } = this.getActorIdentity(actor);

    this.businessEvents.log({
      ...payload,
      actorId,
      actorEmail: actorLabel,
      actorRole,
      metadata: payload.metadata,
    });
  }

  private async getPageOrThrow(id: number) {
    const page = await this.prisma.sitePage.findFirst({
      where: { id, deletedAt: null },
      include: {
        sections: {
          where: { deletedAt: null },
          orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        },
        faqs: {
          where: { deletedAt: null },
          orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        },
        versions: {
          orderBy: [{ versionNumber: 'desc' }],
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Khong tim thay page content.');
    }

    return page;
  }

  private buildSnapshot(
    page: {
      id: number;
      slug: string;
      title: string;
      seoTitle: string | null;
      seoDescription: string | null;
      heroBadge: string | null;
      heroTitle: string | null;
      heroDescription: string | null;
      workflowStatus: ContentWorkflowStatus;
      publishedVersionId: number | null;
      submittedAt: Date | null;
      approvedAt: Date | null;
      publishedAt: Date | null;
      sections: Array<{
        id: number;
        sectionKey: string;
        title: string | null;
        subtitle: string | null;
        description: string | null;
        imageUrl: string | null;
        primaryButtonLabel: string | null;
        primaryButtonHref: string | null;
        secondaryButtonLabel: string | null;
        secondaryButtonHref: string | null;
        contentJson: Prisma.JsonValue | null;
        displayOrder: number;
        isActive: boolean;
      }>;
      faqs: Array<{
        id: number;
        question: string;
        answer: string;
        displayOrder: number;
        isActive: boolean;
      }>;
    },
  ): PageSnapshot {
    return {
      id: page.id,
      slug: page.slug,
      title: page.title,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      heroBadge: page.heroBadge,
      heroTitle: page.heroTitle,
      heroDescription: page.heroDescription,
      workflowStatus: page.workflowStatus,
      publishedVersionId: page.publishedVersionId,
      submittedAt: page.submittedAt,
      approvedAt: page.approvedAt,
      publishedAt: page.publishedAt,
      sections: page.sections.map((section) => ({
        id: section.id,
        sectionKey: section.sectionKey,
        title: section.title,
        subtitle: section.subtitle,
        description: section.description,
        imageUrl: section.imageUrl,
        primaryButtonLabel: section.primaryButtonLabel,
        primaryButtonHref: section.primaryButtonHref,
        secondaryButtonLabel: section.secondaryButtonLabel,
        secondaryButtonHref: section.secondaryButtonHref,
        contentJson: section.contentJson as Prisma.JsonValue | null,
        displayOrder: section.displayOrder,
        isActive: section.isActive,
      })),
      faqs: page.faqs.map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        displayOrder: faq.displayOrder,
        isActive: faq.isActive,
      })),
    };
  }

  private normalizePublishedData(snapshot: PageSnapshot) {
    return {
      ...snapshot,
      sections: snapshot.sections
        .filter((section) => section.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id),
      faqs: snapshot.faqs
        .filter((faq) => faq.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id),
    };
  }

  private async markPageAsDraft(pageId: number, actor?: JwtPayload | null) {
    const { actorRef } = this.getActorIdentity(actor);

    await this.prisma.sitePage.update({
      where: { id: pageId },
      data: {
        workflowStatus: ContentWorkflowStatus.DRAFT,
        submittedAt: null,
        approvedAt: null,
        updatedBy: actorRef,
      },
    });
  }

  private async createVersion(pageId: number, workflowStatus: ContentWorkflowStatus, notes?: string | null, actor?: JwtPayload | null) {
    const page = await this.getPageOrThrow(pageId);
    const { actorRef } = this.getActorIdentity(actor);
    const nextVersionNumber = (page.versions[0]?.versionNumber ?? 0) + 1;
    const snapshot = this.buildSnapshot(page);

    return this.prisma.sitePageVersion.create({
      data: {
        pageId,
        versionNumber: nextVersionNumber,
        workflowStatus,
        notes: notes || null,
        snapshotJson: snapshot as Prisma.InputJsonValue,
        approvedBy: workflowStatus === ContentWorkflowStatus.APPROVED ? actorRef : null,
        publishedBy: workflowStatus === ContentWorkflowStatus.PUBLISHED ? actorRef : null,
      },
    });
  }

  async findAuditLogs(pageId?: number) {
    const logs = await this.prisma.contentAuditLog.findMany({
      where: pageId
        ? {
            OR: [
              {
                entityType: 'site_page',
                entityId: String(pageId),
              },
              {
                metadata: {
                  path: '$.pageId',
                  equals: pageId,
                },
              },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lay lich su audit content thanh cong.',
      data: logs,
    };
  }

  private async getLatestVersion(pageId: number) {
    return this.prisma.sitePageVersion.findFirst({
      where: { pageId },
      orderBy: [{ versionNumber: 'desc' }],
    });
  }

  async findPageBySlug(slug: string) {
    try {
      const page = await this.prisma.sitePage.findFirst({
        where: {
          slug,
          deletedAt: null,
        },
        include: {
          sections: { where: { deletedAt: null }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
          faqs: { where: { deletedAt: null }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
          publishedVersion: true,
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

      const publishedSnapshot = page.publishedVersion?.snapshotJson as PageSnapshot | null;
      const data = publishedSnapshot ? this.normalizePublishedData(publishedSnapshot) : this.normalizePublishedData(this.buildSnapshot(page));

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Lay noi dung trang thanh cong.',
        data,
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
        versions: {
          orderBy: [{ versionNumber: 'desc' }],
          take: 5,
        },
        publishedVersion: true,
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

  async createPage(createSitePageDto: CreateSitePageDto, actor?: JwtPayload | null) {
    const { actorRef } = this.getActorIdentity(actor);
    const page = await this.prisma.sitePage.create({
      data: {
        ...createSitePageDto,
        workflowStatus: ContentWorkflowStatus.DRAFT,
        createdBy: actorRef,
        updatedBy: actorRef,
      },
    });

    this.logContentEvent({
      entity: 'site_page',
      action: 'content.page.create',
      entityId: page.id,
      metadata: {
        slug: page.slug,
      },
    }, actor);

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Tao page content thanh cong.',
      data: page,
    };
  }

  async updatePage(id: number, updateSitePageDto: UpdateSitePageDto, actor?: JwtPayload | null) {
    const { actorRef } = this.getActorIdentity(actor);
    const page = await this.prisma.sitePage.update({
      where: { id },
      data: {
        ...updateSitePageDto,
        workflowStatus: ContentWorkflowStatus.DRAFT,
        submittedAt: null,
        approvedAt: null,
        updatedBy: actorRef,
      },
    });

    this.logContentEvent({
      entity: 'site_page',
      action: 'content.page.update',
      entityId: page.id,
      metadata: updateSitePageDto as Record<string, unknown>,
    }, actor);

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cap nhat page content thanh cong.',
      data: page,
    };
  }

  async removePage(id: number, actor?: JwtPayload | null) {
    await this.prisma.sitePage.delete({
      where: { id },
    });

    this.logContentEvent({
      entity: 'site_page',
      action: 'content.page.delete',
      entityId: id,
    }, actor);

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa page content thanh cong.',
      data: { id },
    };
  }

  async upsertSection(pageId: number, dto: UpsertPageSectionDto, actor?: JwtPayload | null) {
    const { actorRef } = this.getActorIdentity(actor);
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
            updatedBy: actorRef,
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
            createdBy: actorRef,
            updatedBy: actorRef,
          },
        });

    await this.markPageAsDraft(pageId, actor);

    this.logContentEvent({
      entity: 'page_section',
      action: dto.id ? 'content.section.update' : 'content.section.create',
      entityId: section.id,
      metadata: {
        pageId,
        sectionKey: section.sectionKey,
      },
    }, actor);

    return {
      success: true,
      statusCode: dto.id ? StatusCodes.OK : StatusCodes.CREATED,
      message: 'Luu page section thanh cong.',
      data: section,
    };
  }

  async removeSection(id: number, actor?: JwtPayload | null) {
    const section = await this.prisma.pageSection.delete({
      where: { id },
    });

    await this.markPageAsDraft(section.pageId, actor);

    this.logContentEvent({
      entity: 'page_section',
      action: 'content.section.delete',
      entityId: id,
      metadata: {
        pageId: section.pageId,
      },
    }, actor);

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa page section thanh cong.',
      data: { id },
    };
  }

  async upsertFaq(pageId: number, dto: UpsertFaqItemDto, actor?: JwtPayload | null) {
    const { actorRef } = this.getActorIdentity(actor);
    const faq = dto.id
      ? await this.prisma.faqItem.update({
          where: { id: dto.id },
          data: {
            question: dto.question,
            answer: dto.answer,
            displayOrder: dto.displayOrder ?? 0,
            isActive: dto.isActive ?? true,
            updatedBy: actorRef,
          },
        })
      : await this.prisma.faqItem.create({
          data: {
            pageId,
            question: dto.question,
            answer: dto.answer,
            displayOrder: dto.displayOrder ?? 0,
            isActive: dto.isActive ?? true,
            createdBy: actorRef,
            updatedBy: actorRef,
          },
        });

    await this.markPageAsDraft(pageId, actor);

    this.logContentEvent({
      entity: 'faq_item',
      action: dto.id ? 'content.faq.update' : 'content.faq.create',
      entityId: faq.id,
      metadata: {
        pageId,
      },
    }, actor);

    return {
      success: true,
      statusCode: dto.id ? StatusCodes.OK : StatusCodes.CREATED,
      message: 'Luu FAQ thanh cong.',
      data: faq,
    };
  }

  async removeFaq(id: number, actor?: JwtPayload | null) {
    const faq = await this.prisma.faqItem.delete({
      where: { id },
    });

    await this.markPageAsDraft(faq.pageId, actor);

    this.logContentEvent({
      entity: 'faq_item',
      action: 'content.faq.delete',
      entityId: id,
      metadata: {
        pageId: faq.pageId,
      },
    }, actor);

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xoa FAQ thanh cong.',
      data: { id },
    };
  }

  async submitPageForReview(id: number, dto: ReviewSitePageDto, actor?: JwtPayload | null) {
    const { actorRef } = this.getActorIdentity(actor);
    const currentPage = await this.getPageOrThrow(id);
    if (!currentPage.sections.length) {
      throw new BadRequestException('Page can it nhat mot section truoc khi gui review.');
    }

    const version = await this.createVersion(id, ContentWorkflowStatus.IN_REVIEW, dto.notes, actor);

    const page = await this.prisma.sitePage.update({
      where: { id },
      data: {
        workflowStatus: ContentWorkflowStatus.IN_REVIEW,
        submittedAt: new Date(),
        approvedAt: null,
        updatedBy: actorRef,
      },
      include: {
        sections: { where: { deletedAt: null }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
        faqs: { where: { deletedAt: null }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
        versions: { orderBy: [{ versionNumber: 'desc' }], take: 5 },
        publishedVersion: true,
      },
    });

    this.logContentEvent({
      entity: 'site_page',
      action: 'content.page.submit_review',
      entityId: id,
      metadata: {
        versionId: version.id,
        notes: dto.notes ?? null,
      },
    }, actor);

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Da gui page vao quy trinh review.',
      data: page,
    };
  }

  async approvePage(id: number, dto: ReviewSitePageDto, actor?: JwtPayload | null) {
    const { actorRef } = this.getActorIdentity(actor);
    const latestVersion = await this.getLatestVersion(id);

    if (!latestVersion) {
      throw new NotFoundException('Chua co version de phe duyet.');
    }

    if (latestVersion.workflowStatus !== ContentWorkflowStatus.IN_REVIEW) {
      throw new BadRequestException('Chi co the approve version dang o trang thai in review.');
    }

    await this.prisma.sitePageVersion.update({
      where: { id: latestVersion.id },
      data: {
        workflowStatus: ContentWorkflowStatus.APPROVED,
        notes: dto.notes ?? latestVersion.notes,
        approvedBy: actorRef,
      },
    });

    const page = await this.prisma.sitePage.update({
      where: { id },
      data: {
        workflowStatus: ContentWorkflowStatus.APPROVED,
        approvedAt: new Date(),
        updatedBy: actorRef,
      },
      include: {
        sections: { where: { deletedAt: null }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
        faqs: { where: { deletedAt: null }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
        versions: { orderBy: [{ versionNumber: 'desc' }], take: 5 },
        publishedVersion: true,
      },
    });

    this.logContentEvent({
      entity: 'site_page',
      action: 'content.page.approve',
      entityId: id,
      metadata: {
        versionId: latestVersion.id,
        notes: dto.notes ?? null,
      },
    }, actor);

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Da phe duyet page content.',
      data: page,
    };
  }

  async requestChanges(id: number, dto: ReviewSitePageDto, actor?: JwtPayload | null) {
    const { actorRef } = this.getActorIdentity(actor);
    const latestVersion = await this.getLatestVersion(id);

    if (latestVersion) {
      await this.prisma.sitePageVersion.update({
        where: { id: latestVersion.id },
        data: {
          workflowStatus: ContentWorkflowStatus.CHANGES_REQUESTED,
          notes: dto.notes ?? latestVersion.notes,
        },
      });
    }

    const page = await this.prisma.sitePage.update({
      where: { id },
      data: {
        workflowStatus: ContentWorkflowStatus.CHANGES_REQUESTED,
        approvedAt: null,
        updatedBy: actorRef,
      },
      include: {
        sections: { where: { deletedAt: null }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
        faqs: { where: { deletedAt: null }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
        versions: { orderBy: [{ versionNumber: 'desc' }], take: 5 },
        publishedVersion: true,
      },
    });

    this.logContentEvent({
      entity: 'site_page',
      action: 'content.page.request_changes',
      entityId: id,
      metadata: {
        versionId: latestVersion?.id ?? null,
        notes: dto.notes ?? null,
      },
    }, actor);

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Da yeu cau cap nhat lai noi dung.',
      data: page,
    };
  }

  async publishPage(id: number, dto: ReviewSitePageDto, actor?: JwtPayload | null) {
    const { actorRef } = this.getActorIdentity(actor);
    const version = await this.getLatestVersion(id);

    if (!version) {
      throw new BadRequestException('Khong the publish khi chua co version duoc review va approve.');
    }

    if (version.workflowStatus !== ContentWorkflowStatus.APPROVED) {
      throw new BadRequestException('Chi co the publish version da duoc approve.');
    }

    const publishedVersion = await this.prisma.sitePageVersion.update({
      where: { id: version.id },
      data: {
        workflowStatus: ContentWorkflowStatus.PUBLISHED,
        notes: dto.notes ?? version.notes,
        publishedBy: actorRef,
      },
    });

    const page = await this.prisma.sitePage.update({
      where: { id },
      data: {
        workflowStatus: ContentWorkflowStatus.PUBLISHED,
        approvedAt: new Date(),
        publishedAt: new Date(),
        publishedVersionId: publishedVersion.id,
        updatedBy: actorRef,
      },
      include: {
        sections: { where: { deletedAt: null }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
        faqs: { where: { deletedAt: null }, orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }] },
        versions: { orderBy: [{ versionNumber: 'desc' }], take: 5 },
        publishedVersion: true,
      },
    });

    this.logContentEvent({
      entity: 'site_page',
      action: 'content.page.publish',
      entityId: id,
      metadata: {
        versionId: publishedVersion.id,
        notes: dto.notes ?? null,
      },
    }, actor);

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Da publish page content len public site.',
      data: page,
    };
  }
}
