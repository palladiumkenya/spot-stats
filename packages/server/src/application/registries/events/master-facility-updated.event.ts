import { IEvent } from '@nestjs/cqrs';

export class MasterFacilityUpdatedEvent implements IEvent {
  constructor(public readonly _id: string) {}
}
