import { IEventHandler } from '@nestjs/cqrs';
import { MasterFacilityUpdatedEvent } from '../master-facility-updated.event';
export declare class MasterFacilityUpdatedHandler implements IEventHandler<MasterFacilityUpdatedEvent> {
    handle(event: MasterFacilityUpdatedEvent): any;
}
