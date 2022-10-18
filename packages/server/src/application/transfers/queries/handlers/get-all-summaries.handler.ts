import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IFacilityRepository } from '../../../../domain';
import { Inject, Logger } from '@nestjs/common';
import { GetAllSummaryQuery } from './../get-all-summary.query';

@QueryHandler(GetAllSummaryQuery)
export class GetAllSummaryHandler implements IQueryHandler<GetAllSummaryQuery, any> {
  constructor(
    @Inject('IFacilityRepository')
    private readonly repository: IFacilityRepository,
  ) {}

  async execute(query: GetAllSummaryQuery): Promise<any> {
    const fac = await this.repository.getSummaryAll();
    return fac;
  }
}
