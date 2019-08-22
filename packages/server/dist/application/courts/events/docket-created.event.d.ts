import { IEvent } from '@nestjs/cqrs';
export declare class DocketCreatedEvent implements IEvent {
    readonly _id: string;
    constructor(_id: string);
}
