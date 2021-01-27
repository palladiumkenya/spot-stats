import {AggregateRoot} from '@nestjs/cqrs';
import * as uuid from 'uuid';

export class Indicator extends AggregateRoot {
    public _id: string;
    public name: string;
    public value: string;
    public indicatorDate: Date;
    public stage: string;
    public facility: any;
    public facilityManifestId: string;
    public createDate: Date;

    constructor() {
        super();
        this._id = uuid.v1();
        this.createDate = new Date();
    }
}
