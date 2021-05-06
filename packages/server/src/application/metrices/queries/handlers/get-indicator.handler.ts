import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {GetIndicatorQuery} from '../get-indicator.query';
import {Inject} from '@nestjs/common';
import {IIndicatorRepository} from '../../../../domain/metrices/indicator-repository.interface';

@QueryHandler(GetIndicatorQuery)
export class GetIndicatorHandler implements IQueryHandler<GetIndicatorQuery, any> {
    constructor(
        @Inject('IIndicatorRepository')
        private readonly repository: IIndicatorRepository,
    ) {
    }

    async execute(query: GetIndicatorQuery): Promise<any> {
        return await this.repository.findByFacilityId(query.facilityId);
    }
}
