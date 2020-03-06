import { AggregateRoot } from '@nestjs/cqrs';

export class NoticeBoard extends AggregateRoot {
  constructor(public _id: string, public message: string, public rank: number) {
    super();
  }
}
