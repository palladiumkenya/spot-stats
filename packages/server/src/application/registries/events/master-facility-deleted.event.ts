import { IEvent } from '@nestjs/cqrs';

export class MasterFacilityDeletedEvent implements IEvent {
  constructor(public readonly _id: string) {
  }
}
