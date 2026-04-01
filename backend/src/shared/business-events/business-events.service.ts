import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../modules/prisma/prisma.service';

type BusinessEventPayload = {
  entity?: string;
  action: string;
  entityId?: number | string | null;
  actorId?: number | string | null;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class BusinessEventsService {
  private readonly logger = new Logger(BusinessEventsService.name);

  constructor(private readonly prisma: PrismaService) {}

  log(payload: BusinessEventPayload) {
    const event = {
      type: 'business_event',
      timestamp: new Date().toISOString(),
      ...payload,
    };

    this.logger.log(JSON.stringify(event));

    void this.prisma.contentAuditLog
      .create({
        data: {
          entityType: payload.entity ?? 'unknown',
          entityId: payload.entityId == null ? null : String(payload.entityId),
          action: payload.action,
          actorId: payload.actorId == null ? null : String(payload.actorId),
          metadata: (payload.metadata as Prisma.InputJsonValue | undefined) ?? undefined,
        },
      })
      .catch((error) => {
        this.logger.error(
          `Khong the luu audit log cho action ${payload.action}.`,
          error instanceof Error ? error.stack : String(error),
        );
      });
  }
}
