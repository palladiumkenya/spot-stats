import * as uuid from 'uuid';

export class Summary {
  public _id: string;

  constructor(
    public docket: any,
    public extract: any,
    public expected?: number,
    public recieved?: number,
    public updated?: Date,
  ) {
    this._id = uuid.v1();
  }
}
