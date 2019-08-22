import { IEvent } from '@nestjs/cqrs';
export declare class FacilityUpdatedEvent implements IEvent {
    readonly _id: string;
    constructor(_id: string);
}
