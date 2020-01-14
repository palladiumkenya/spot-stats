import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  IDocketRepository,
  IFacilityRepository,
  IMasterFacilityRepository,
} from '../../../../domain';
import { MetricLoggedEvent } from '../metric-logged.event';

@EventsHandler(MetricLoggedEvent)
export class MetricLoggedHandler implements IEventHandler<MetricLoggedEvent> {
  handle(event: MetricLoggedEvent) {
    Logger.debug(`=== MetricLoggedEvent ===:${event.facilityId}`);
  }
}
