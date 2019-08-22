import { IEvent } from '@nestjs/cqrs';
export declare class FacilityEnrolledEvent implements IEvent {
    readonly _id: string;
    constructor(_id: string);
}
