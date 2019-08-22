import { IEvent } from '@nestjs/cqrs';

export class DocketDeletedEvent implements IEvent {
  constructor(public readonly _id: string) {
  }
}
