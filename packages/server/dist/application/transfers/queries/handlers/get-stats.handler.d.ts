import { IQueryHandler } from '@nestjs/cqrs';
import { GetStatsQuery } from '../get-stats.query';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
export declare class GetStatsHandler implements IQueryHandler<GetStatsQuery, any> {
    private readonly repository;
    constructor(repository: IManifestRepository);
    execute(query: GetStatsQuery): Promise<any>;
}
