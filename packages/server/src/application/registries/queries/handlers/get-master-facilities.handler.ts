import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMasterFacilitiesQuery } from '../get-master-facilities.query';
import { MasterFacilityDto } from '../../../../domain/registries/dtos/master-facility.dto';
import { IMasterFacilityRepository } from '../../../../domain/registries/master-facility-repository.interface';

@QueryHandler(GetMasterFacilitiesQuery)
export class GetMasterFacilitiesHandler implements IQueryHandler<GetMasterFacilitiesQuery, MasterFacilityDto[]> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly repository: IMasterFacilityRepository) {
  }

  async execute(query: GetMasterFacilitiesQuery): Promise<MasterFacilityDto[]> {
    const results = await this.repository.getAll();
    return results;
  }
}
