import * as uuid from 'uuid';

export class Manifest {
  public _id: string;

  constructor(
    public mId: string,
    public logDate: Date,
    public buildDate: Date,
    public docket: string,
    public patientCount: number,
    public cargo: any,
  ) {
    this._id = uuid.v1();
  }
}
