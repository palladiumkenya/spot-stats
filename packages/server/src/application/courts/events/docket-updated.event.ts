import { IEvent } from '@nestjs/cqrs';

export class DocketUpdatedEvent implements IEvent {
  constructor(public readonly _id: string) {
  }
}

