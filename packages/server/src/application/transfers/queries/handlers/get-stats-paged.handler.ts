import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDocketsQuery } from '../../../courts/queries';
import { GetStatsPagedQuery } from '../get-stats-paged.query';
import { Inject } from '@nestjs/common';
import { IFacilityRepository } from '../../../../domain';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';

@QueryHandler(GetStatsPagedQuery)
export class GetStatsPagedHandler
  implements IQueryHandler<GetStatsPagedQuery, any> {
  constructor(
    @Inject('IManifestRepository')
    private readonly repository: IManifestRepository,
  ) {}
  async execute(query: GetStatsPagedQuery): Promise<any> {
    return await this.repository.getAllCurrentPaged(
      query.size,
      query.page,
      query.sort,
      query.filter,
    );
  }
}
