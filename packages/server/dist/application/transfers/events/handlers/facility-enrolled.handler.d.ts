import { FacilityEnrolledEvent } from '../facility-enrolled.event';
import { IEventHandler } from '@nestjs/cqrs';
export declare class FacilityEnrolledHandler implements IEventHandler<FacilityEnrolledEvent> {
    handle(event: FacilityEnrolledEvent): void;
}
