import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ManifestLoggedEvent } from '../manifest-logged.event';
import { Inject, Logger } from '@nestjs/common';
import {
  IDocketRepository,
  IFacilityRepository,
  IMasterFacilityRepository,
  Summary,
} from '../../../../domain';

@EventsHandler(ManifestLoggedEvent)
export class ManifestLoggedHandler
  implements IEventHandler<ManifestLoggedEvent> {
  handle(event: ManifestLoggedEvent) {
    Logger.debug(`=== ManifestLogged ===:${event.manifestId}`);
  }
}
