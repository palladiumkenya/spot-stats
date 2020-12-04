import { IEvent } from '@nestjs/cqrs';

export class DocketCreatedEvent implements IEvent {
  constructor(public readonly _id: string) {}
}
