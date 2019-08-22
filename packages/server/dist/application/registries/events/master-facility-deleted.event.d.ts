import { IEvent } from '@nestjs/cqrs';
export declare class MasterFacilityDeletedEvent implements IEvent {
    readonly _id: string;
    constructor(_id: string);
}
