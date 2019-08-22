import { IQueryHandler } from '@nestjs/cqrs';
import { GetMasterFacilitiesQuery } from '../get-master-facilities.query';
import { MasterFacilityDto } from '../../../../domain/registries/dtos/master-facility.dto';
import { IMasterFacilityRepository } from '../../../../domain/registries/master-facility-repository.interface';
export declare class GetMasterFacilitiesHandler implements IQueryHandler<GetMasterFacilitiesQuery, MasterFacilityDto[]> {
    private readonly repository;
    constructor(repository: IMasterFacilityRepository);
    execute(query: GetMasterFacilitiesQuery): Promise<MasterFacilityDto[]>;
}
