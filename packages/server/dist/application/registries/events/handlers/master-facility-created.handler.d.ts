import { IEventHandler } from '@nestjs/cqrs';
import { MasterFacilityCreatedEvent } from '../master-facility-created.event';
export declare class MasterFacilityCreatedHandler implements IEventHandler<MasterFacilityCreatedEvent> {
    handle(event: MasterFacilityCreatedEvent): any;
}
