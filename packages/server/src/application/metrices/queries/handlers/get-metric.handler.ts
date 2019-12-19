import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IMetricRepository } from '../../../../domain/metrices/metric-repository.interface';
import { GetMetricQuery } from '../get-metric.query';

@QueryHandler(GetMetricQuery)
export class GetMetricHandler implements IQueryHandler<GetMetricQuery, any> {
  constructor(
    @Inject('IMetricRepository')
    private readonly repository: IMetricRepository,
  ) {}
  async execute(query: GetMetricQuery): Promise<any> {
    return await this.repository.getAll();
  }
}
