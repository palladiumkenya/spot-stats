import { IQueryHandler } from '@nestjs/cqrs';
import { GetSummaryQuery } from '../get-summary.query';
import { IFacilityRepository } from '../../../../domain';
export declare class GetSummaryHandler implements IQueryHandler<GetSummaryQuery, any> {
    private readonly repository;
    constructor(repository: IFacilityRepository);
    execute(query: GetSummaryQuery): Promise<any>;
}
