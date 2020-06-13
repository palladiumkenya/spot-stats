import { FacilityEnrolledEvent } from '../facility-enrolled.event';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  IDocketRepository,
  IFacilityRepository,
  IMasterFacilityRepository,
} from '../../../../domain';

@EventsHandler(FacilityEnrolledEvent)
export class FacilityEnrolledHandler
  implements IEventHandler<FacilityEnrolledEvent> {
  handle(event: FacilityEnrolledEvent) {
    Logger.debug(`=== FacilityEnrolled ===`);
  }
}
