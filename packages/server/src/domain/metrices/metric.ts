import * as uuid from 'uuid';
import { AggregateRoot } from '@nestjs/cqrs';

export class Metric extends AggregateRoot {
  public _id: string;

  constructor(
    public mId: string,
    public measure: any,
    public facility: any,
    public report: any,
    public facilityManifestId: string,
  ) {
    super();
    this._id = uuid.v1();
  }
}
