import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSummaryQuery } from '../get-summary.query';
import { IFacilityRepository } from '../../../../domain';
import { Inject } from '@nestjs/common';

@QueryHandler(GetSummaryQuery)
export class GetSummaryHandler implements IQueryHandler<GetSummaryQuery, any> {
  constructor(
    @Inject('IFacilityRepository')
    private readonly repository: IFacilityRepository,
  ) {}
  async execute(query: GetSummaryQuery): Promise<any> {
    return await this.repository.getSummary(query._id);
  }
}
