import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { JwtPayload } from '../../modules/auth/interfaces/jwt-payload.interface';

type BusinessEventPayload = {
  entity?: string;
  action: string;
  entityId?: number | string | null;
  actorId?: number | string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  metadata?: Record<string, unknown>;
  actor?: Pick<JwtPayload, 'sub' | 'email' | 'role'> | null;
};

@Injectable()
export class BusinessEventsService {
  private readonly logger = new Logger(BusinessEventsService.name);

  constructor(private readonly prisma: PrismaService) {}

  log(payload: BusinessEventPayload) {
    const actorId = payload.actor?.sub ?? payload.actorId ?? null;
    const actorEmail = payload.actor?.email ?? payload.actorEmail ?? null;
    const actorRole = payload.actor?.role ?? payload.actorRole ?? null;
    const metadata = {
      ...(payload.metadata ?? {}),
      actorEmail,
      actorRole,
    };

    const event = {
      type: 'business_event',
      timestamp: new Date().toISOString(),
      ...payload,
      actorId,
      actorEmail,
      actorRole,
      metadata,
    };

    this.logger.log(JSON.stringify(event));

    void this.prisma.contentAuditLog
      .create({
        data: {
          entityType: payload.entity ?? 'unknown',
          entityId: payload.entityId == null ? null : String(payload.entityId),
          action: payload.action,
          actorId: actorId == null ? null : String(actorId),
          metadata: metadata as Prisma.InputJsonValue,
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
