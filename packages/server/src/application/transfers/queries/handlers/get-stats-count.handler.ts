import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
import { GetStatsCountQuery } from '../get-stats-count.query';

@QueryHandler(GetStatsCountQuery)
export class GetStatsCountHandler
  implements IQueryHandler<GetStatsCountQuery, any> {
  constructor(
    @Inject('IManifestRepository')
    private readonly repository: IManifestRepository,
  ) {}
  async execute(query: GetStatsCountQuery): Promise<any> {
    return await this.repository.getCount();
  }
}
