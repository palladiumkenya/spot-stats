import { IEvent } from '@nestjs/cqrs';

export class MasterFacilityCreatedEvent implements IEvent {
  constructor(public readonly _id: string) {
  }
}

