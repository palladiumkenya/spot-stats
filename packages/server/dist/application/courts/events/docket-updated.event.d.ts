import { IEvent } from '@nestjs/cqrs';
export declare class DocketUpdatedEvent implements IEvent {
    readonly _id: string;
    constructor(_id: string);
}
