import * as uuid from 'uuid';

export class Extract {
  _id: string;

  constructor(
    public name: string,
    public display: string,
    public isPatient: boolean,
    public rank: number,
  ) {
    this._id = uuid();
  }

  toString() {
    return `${this.display}`;
  }
}
