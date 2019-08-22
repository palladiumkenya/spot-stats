import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DocketDeletedEvent } from '../docket-deleted.event';

@EventsHandler(DocketDeletedEvent)
export class DocketDeletedEventHandler implements IEventHandler<DocketDeletedEvent> {
  handle(event: DocketDeletedEvent): any {
    Logger.debug(`=== DocketDeleted ===:${event._id}`);
  }
}
