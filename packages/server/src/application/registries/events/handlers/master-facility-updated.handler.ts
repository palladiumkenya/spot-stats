import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MasterFacilityUpdatedEvent } from '../master-facility-updated.event';

@EventsHandler(MasterFacilityUpdatedEvent)
export class MasterFacilityUpdatedHandler
  implements IEventHandler<MasterFacilityUpdatedEvent> {
  handle(event: MasterFacilityUpdatedEvent): any {
    Logger.debug(`=== MasterFacilityUpdated ===:${event._id}`);
  }
}
