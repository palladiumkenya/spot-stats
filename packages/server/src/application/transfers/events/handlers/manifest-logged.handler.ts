import {
  CommandBus,
  EventPublisher,
  EventsHandler,
  IEventHandler,
} from '@nestjs/cqrs';
import { ManifestLoggedEvent } from '../manifest-logged.event';
import { Inject, Logger } from '@nestjs/common';
import { InitializeSummariesCommand } from '../../commands/initialize-summaries-command';

@EventsHandler(ManifestLoggedEvent)
export class ManifestLoggedHandler
  implements IEventHandler<ManifestLoggedEvent> {
  constructor(private readonly commandBus: CommandBus) {}
  async handle(event: ManifestLoggedEvent) {
    Logger.debug(`=== ManifestLogged ===:${event.manifestId}`);
    await this.commandBus.execute(
      new InitializeSummariesCommand(event.facilityId, event.manifestId),
    );
  }
}
