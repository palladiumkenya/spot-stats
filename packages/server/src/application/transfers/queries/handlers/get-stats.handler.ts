import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
import { GetStatsQuery } from '../get-stats.query';

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
