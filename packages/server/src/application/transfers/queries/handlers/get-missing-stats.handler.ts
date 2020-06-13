import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
import { GetStatsQuery } from '../get-stats.query';
import { GetMisssingStatsQuery } from '../get-misssing-stats.query';

@QueryHandler(GetMisssingStatsQuery)
export class GetMisssingStatsHandler
  implements IQueryHandler<GetMisssingStatsQuery, any> {
  constructor(
    @Inject('IManifestRepository')
    private readonly repository: IManifestRepository,
  ) {}
  async execute(query: GetMisssingStatsQuery): Promise<any> {
    return await this.repository.getCurrentMissing();
  }
}
