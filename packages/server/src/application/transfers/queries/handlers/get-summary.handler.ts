import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSummaryQuery } from '../get-summary.query';
import { IFacilityRepository } from '../../../../domain';
import { Inject } from '@nestjs/common';
import { IMetricRepository } from '../../../../domain/metrices/metric-repository.interface';

@QueryHandler(GetSummaryQuery)
export class GetSummaryHandler implements IQueryHandler<GetSummaryQuery, any> {
  constructor(
    @Inject('IFacilityRepository')
    private readonly repository: IFacilityRepository,
    @Inject('IMetricRepository')
    private readonly metricRepository: IMetricRepository,
  ) {}

  async execute(query: GetSummaryQuery): Promise<any> {
    const fac = await this.repository.getSummary(query._id);
    const metrics = await this.metricRepository.findByFacilityId(query._id);
    if (metrics && metrics.length > 0) {
      fac.metrics = metrics
        .filter((x) => x.measure && x.measure.rank)
        .sort((a, b) => {
          if (a.measure.rank > b.measure.rank) {
            return 1;
          }
          if (b.measure.rank > a.measure.rank) {
            return -1;
          }
          return 0;
        });
    }
    return fac;
  }
}
