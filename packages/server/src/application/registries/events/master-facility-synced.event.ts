import { IEvent } from '@nestjs/cqrs';
import { MasterFacility } from '../../../domain';

export class MasterFacilitySyncedEvent implements IEvent {
  constructor(public masterFacility: MasterFacility) {}
}
