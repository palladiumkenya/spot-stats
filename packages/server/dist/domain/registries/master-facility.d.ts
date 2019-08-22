import { AggregateRoot } from '@nestjs/cqrs';
export declare class MasterFacility extends AggregateRoot {
    _id: string;
    code: number;
    name: string;
    county?: any;
    mechanism?: any;
    constructor(_id: string, code: number, name: string, county?: any, mechanism?: any);
    changeDetails(code: number, name: any, county?: any, mechanism?: any): void;
}
