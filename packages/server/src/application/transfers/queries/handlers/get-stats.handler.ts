import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDocketsQuery } from '../../../courts/queries';
import { GetStatsQuery } from '../get-stats.query';
import { Inject } from '@nestjs/common';
import { IFacilityRepository } from '../../../../domain';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';

@QueryHandler(GetStatsQuery)
export class GetStatsHandler implements IQueryHandler<GetStatsQuery, any> {
  constructor(
    @Inject('IManifestRepository')
    private readonly repository: IManifestRepository,
  ) {}
  async execute(query: GetStatsQuery): Promise<any> {
    return await this.repository.getCurrent();
  }
}
