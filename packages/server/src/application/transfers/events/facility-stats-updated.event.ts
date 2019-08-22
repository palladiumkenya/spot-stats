import { IEvent } from '@nestjs/cqrs';

export class FacilityStatsUpdatedEvent implements IEvent {
  constructor(public readonly _id: string) {}
}
