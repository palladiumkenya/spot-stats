import { IEvent } from '@nestjs/cqrs';

export class FacilityEnrolledEvent implements IEvent {
  constructor(public readonly _id: string) {}
}
