import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MasterFacilityDto } from '../../../domain/registries/dtos/master-facility.dto';
export declare class MasterFacilitiesController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    getMasterFacilities(): Promise<any>;
    createOrUpdateMasterFacility(docket: MasterFacilityDto): Promise<any>;
    deleteMasterFacility(id: any): Promise<any>;
    handleUpdated(data: any): Promise<any>;
    handleCreated(data: any): Promise<any>;
}
