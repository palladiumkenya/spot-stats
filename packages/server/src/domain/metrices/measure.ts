import { AggregateRoot } from '@nestjs/cqrs';
import * as uuid from 'uuid';

export class Measure extends AggregateRoot {
  public _id: string;
  public rank: number;

  constructor(
    public name: string,
    public area: string,
    public display: string,
    public description: string,
  ) {
    super();
    this._id = uuid.v1();
  }
}
