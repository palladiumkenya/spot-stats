import { IEvent } from '@nestjs/cqrs';
export declare class FacilityStatsUpdatedEvent implements IEvent {
    readonly _id: string;
    constructor(_id: string);
}
