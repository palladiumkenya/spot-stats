import { IEvent } from '@nestjs/cqrs';

export class FacilityUpdatedEvent implements IEvent {
  constructor(public readonly _id: string) {}
}
