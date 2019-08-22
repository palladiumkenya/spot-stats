import { IEventHandler } from '@nestjs/cqrs';
import { MasterFacilityDeletedEvent } from '../master-facility-deleted.event';
export declare class MasterFacilityDeletedHandler implements IEventHandler<MasterFacilityDeletedEvent> {
    handle(event: MasterFacilityDeletedEvent): any;
}
