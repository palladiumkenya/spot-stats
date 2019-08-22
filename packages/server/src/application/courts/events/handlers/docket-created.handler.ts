import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DocketCreatedEvent } from '../docket-created.event';

@EventsHandler(DocketCreatedEvent)
export class DocketCreatedEventHandler implements IEventHandler<DocketCreatedEvent> {
  handle(event: DocketCreatedEvent): any {
    Logger.debug(`=== DocketCreated ===:${event._id}`);
  }
}
