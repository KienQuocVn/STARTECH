import { Global, Module } from '@nestjs/common';
import { BusinessEventsService } from './business-events.service';

@Global()
@Module({
  providers: [BusinessEventsService],
  exports: [BusinessEventsService],
})
export class BusinessEventsModule {}
