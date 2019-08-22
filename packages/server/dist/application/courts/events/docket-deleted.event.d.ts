import { IEvent } from '@nestjs/cqrs';
export declare class DocketDeletedEvent implements IEvent {
    readonly _id: string;
    constructor(_id: string);
}
