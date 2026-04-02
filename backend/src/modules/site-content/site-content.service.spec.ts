import { Test, TestingModule } from '@nestjs/testing';
import { ContentWorkflowStatus } from '@prisma/client';
import { SiteContentService } from './site-content.service';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessEventsService } from '../../shared/business-events/business-events.service';

describe('SiteContentService', () => {
  let service: SiteContentService;
  let prisma: {
    sitePage: { create: jest.Mock; update: jest.Mock };
    pageSection: { create: jest.Mock };
    contentAuditLog: { findMany: jest.Mock };
  };
  let businessEvents: { log: jest.Mock };

  beforeEach(async () => {
    prisma = {
      sitePage: {
        create: jest.fn(),
        update: jest.fn(),
      },
      pageSection: {
        create: jest.fn(),
      },
      contentAuditLog: {
        findMany: jest.fn(),
      },
    };

    businessEvents = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteContentService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: BusinessEventsService,
          useValue: businessEvents,
        },
      ],
    }).compile();

    service = module.get(SiteContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should persist actor id into createPage audit fields', async () => {
    prisma.sitePage.create.mockResolvedValue({
      id: 7,
      slug: 'dich-vu',
      title: 'Dich vu',
    });

    await service.createPage(
      {
        slug: 'dich-vu',
        title: 'Dich vu',
      },
      {
        sub: 42,
        email: 'editor@startech.local',
        role: 'EDITOR',
        permissions: ['content.write'],
      },
    );

    expect(prisma.sitePage.create).toHaveBeenCalledWith({
      data: {
        slug: 'dich-vu',
        title: 'Dich vu',
        workflowStatus: ContentWorkflowStatus.DRAFT,
        createdBy: '42',
        updatedBy: '42',
      },
    });

    expect(businessEvents.log).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: 42,
        actorEmail: 'editor@startech.local',
        actorRole: 'EDITOR',
      }),
    );
  });

  it('should reset workflow to draft when creating a section', async () => {
    prisma.pageSection.create.mockResolvedValue({
      id: 5,
      pageId: 7,
      sectionKey: 'hero',
    });
    prisma.sitePage.update.mockResolvedValue({});

    await service.upsertSection(
      7,
      {
        sectionKey: 'hero',
        title: 'Hero section',
      },
      {
        sub: 9,
        email: 'admin@startech.local',
        role: 'SUPER_ADMIN',
        permissions: ['content.write'],
      },
    );

    expect(prisma.pageSection.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        pageId: 7,
        sectionKey: 'hero',
        createdBy: '9',
        updatedBy: '9',
      }),
    });

    expect(prisma.sitePage.update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: {
        workflowStatus: ContentWorkflowStatus.DRAFT,
        submittedAt: null,
        approvedAt: null,
        updatedBy: '9',
      },
    });
  });

  it('should read page-scoped audit logs', async () => {
    prisma.contentAuditLog.findMany.mockResolvedValue([
      { id: 1, entityType: 'site_page', entityId: '7', action: 'content.page.update' },
    ]);

    const result = await service.findAuditLogs(7);

    expect(prisma.contentAuditLog.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            entityType: 'site_page',
            entityId: '7',
          },
          {
            metadata: {
              path: '$.pageId',
              equals: 7,
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });
});
