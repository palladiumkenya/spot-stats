import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MasterFacilityCreatedEvent } from '../master-facility-created.event';

@EventsHandler(MasterFacilityCreatedEvent)
export class MasterFacilityCreatedHandler implements IEventHandler<MasterFacilityCreatedEvent> {
  handle(event: MasterFacilityCreatedEvent): any {
    Logger.debug(`=== MasterFacilityCreated ===:${event._id}`);
  }
}
