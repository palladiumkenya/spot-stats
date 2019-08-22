import { IQueryHandler } from '@nestjs/cqrs';
import { DocketDto } from '../../../../domain/courts/dtos/docket.dto';
import { IDocketRepository } from '../../../../domain/courts/docket-repository.interface';
import { GetDocketsQuery } from '../get-dockets.query';
export declare class GetDocketsHandler implements IQueryHandler<GetDocketsQuery, DocketDto[]> {
    private readonly docketRepository;
    constructor(docketRepository: IDocketRepository);
    execute(query: GetDocketsQuery): Promise<DocketDto[]>;
}
