import { Injectable, Logger } from '@nestjs/common';

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

  log(payload: BusinessEventPayload) {
    this.logger.log(
      JSON.stringify({
        type: 'business_event',
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    );
  }
}
