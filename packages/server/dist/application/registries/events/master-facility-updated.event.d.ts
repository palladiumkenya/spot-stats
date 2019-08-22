import { IEvent } from '@nestjs/cqrs';
export declare class MasterFacilityUpdatedEvent implements IEvent {
    readonly _id: string;
    constructor(_id: string);
}
