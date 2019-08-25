import { AggregateRoot } from '@nestjs/cqrs';
import { Facility } from './facility';
export declare class Manifest extends AggregateRoot {
    mId: string;
    code: number;
    name: string;
    logDate: Date;
    buildDate: Date;
    docket: string;
    patientCount: number;
    cargo: any;
    isCurrent: boolean;
    _id: string;
    facility: any;
    facilityInfo: any;
    recievedCount: number;
    recievedDate: Date;
    constructor(mId: string, code: number, name: string, logDate: Date, buildDate: Date, docket: string, patientCount: number, cargo: any, isCurrent: boolean);
    assignFacility(facility: Facility): void;
}
