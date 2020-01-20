import {
  EventPublisher,
  EventsHandler,
  IEvent,
  IEventHandler,
} from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { MasterFacilitySyncedEvent } from '../master-facility-synced.event';
import { IFacilityRepository } from '../../../../domain';
import construct = Reflect.construct;

@EventsHandler(MasterFacilitySyncedEvent)
export class MasterFacilitySyncedHandler
  implements IEventHandler<MasterFacilitySyncedEvent> {
  constructor(
    @Inject('IFacilityRepository')
    private readonly repository: IFacilityRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async handle(event: MasterFacilitySyncedEvent): Promise<any> {
    Logger.debug(`=== MasterFacilitySynced ===:${event.masterFacility.code}`);
    const fac = await this.repository.findByCode(event.masterFacility.code);
    if (fac) {
      fac.masterFacility = event.masterFacility;
      await this.repository.update(fac);
      Logger.debug(
        `=== Facility MasterFacilitySynced ===:${event.masterFacility.code}`,
      );
    }
  }
}
