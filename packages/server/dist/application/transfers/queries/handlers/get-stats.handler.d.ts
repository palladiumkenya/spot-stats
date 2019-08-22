import { IQueryHandler } from '@nestjs/cqrs';
import { GetDocketsQuery } from '../../../courts/queries';
import { IFacilityRepository } from '../../../../domain';
export declare class GetStatsHandler implements IQueryHandler<GetDocketsQuery, any> {
    private readonly repository;
    constructor(repository: IFacilityRepository);
    execute(query: GetDocketsQuery): Promise<any>;
}
