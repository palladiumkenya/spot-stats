import * as uuid from 'uuid';
import { AggregateRoot } from '@nestjs/cqrs';

export class Manifest extends AggregateRoot {
  public _id: string;
  public facility: any;

  constructor(
    public mId: string,
    public code: number,
    public name: string,
    public logDate: Date,
    public buildDate: Date,
    public docket: string,
    public patientCount: number,
    public cargo: any,
    public isCurrent: boolean,
  ) {
    super();
    this._id = uuid.v1();
  }
}
