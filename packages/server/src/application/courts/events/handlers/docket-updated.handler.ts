import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DocketUpdatedEvent } from '../docket-updated.event';

@EventsHandler(DocketUpdatedEvent)
export class DocketUpdatedEventHandler implements IEventHandler<DocketUpdatedEvent> {
  handle(event: DocketUpdatedEvent): any {
    Logger.debug(`=== DocketUpdated ===:${event._id}`);
  }
}
