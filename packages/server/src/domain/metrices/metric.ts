import * as uuid from 'uuid';
import { AggregateRoot } from '@nestjs/cqrs';

export class Metric extends AggregateRoot {
  public _id: string;
  public reportDate: Date;
  public createDate: Date;

  constructor(
    public mId: string,
    public measure: any,
    public facility: any,
    public report: any,
    public facilityManifestId: string,
  ) {
    super();
    this.createDate = new Date();
    this._id = uuid.v1();
  }

  showDisplay(): string {
    return `${this.measure}:${this.report}`;
  }
}
