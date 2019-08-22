import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDocketsQuery } from '../../../courts/queries';
import { GetStatsQuery } from '../get-stats.query';
import { Inject } from '@nestjs/common';
import { IFacilityRepository } from '../../../../domain';

@QueryHandler(GetStatsQuery)
export class GetStatsHandler implements IQueryHandler<GetDocketsQuery, any> {
  constructor(
    @Inject('IFacilityRepository')
    private readonly repository: IFacilityRepository,
  ) {}
  async execute(query: GetDocketsQuery): Promise<any> {
    return await this.repository.getAll();
  }
}
