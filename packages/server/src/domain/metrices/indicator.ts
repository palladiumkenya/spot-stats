import {AggregateRoot} from '@nestjs/cqrs';
import * as uuid from 'uuid';

export class Indicator extends AggregateRoot {
    public _id: string;
    public name: string;
    public value: string;
    public indicatorDate: Date;
    public facility: any;
    public facilityManifestId: string;
    public createDate: Date;
    public dwhValue: string;
    public dwhIndicatorDate: Date;
    Diff(): number {
        // we can be smart to define calc based on indicator
        if (parseInt(this.value, 10) && parseInt(this.dwhValue, 10)) {
            return parseInt(this.value, 10) - parseInt(this.dwhValue, 10);
        } else {
            return null;
        }
    }

    constructor() {
        super();
        this._id = uuid.v1();
        this.createDate = new Date();
    }
}
