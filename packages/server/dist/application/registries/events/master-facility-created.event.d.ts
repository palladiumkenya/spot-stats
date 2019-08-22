import { IEvent } from '@nestjs/cqrs';
export declare class MasterFacilityCreatedEvent implements IEvent {
    readonly _id: string;
    constructor(_id: string);
}
