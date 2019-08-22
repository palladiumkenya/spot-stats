import { IEventHandler } from '@nestjs/cqrs';
import { DocketCreatedEvent } from '../docket-created.event';
export declare class DocketCreatedEventHandler implements IEventHandler<DocketCreatedEvent> {
    handle(event: DocketCreatedEvent): any;
}
