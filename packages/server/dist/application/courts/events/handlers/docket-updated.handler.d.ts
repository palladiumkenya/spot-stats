import { IEventHandler } from '@nestjs/cqrs';
import { DocketUpdatedEvent } from '../docket-updated.event';
export declare class DocketUpdatedEventHandler implements IEventHandler<DocketUpdatedEvent> {
    handle(event: DocketUpdatedEvent): any;
}
