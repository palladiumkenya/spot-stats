import { IEventHandler } from '@nestjs/cqrs';
import { DocketDeletedEvent } from '../docket-deleted.event';
export declare class DocketDeletedEventHandler implements IEventHandler<DocketDeletedEvent> {
    handle(event: DocketDeletedEvent): any;
}
