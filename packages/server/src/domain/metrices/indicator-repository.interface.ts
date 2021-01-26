import {IRepository} from '../../application/common';
import {Indicator} from './indicator';

export interface IIndicatorRepository extends IRepository<Indicator> {
    findByFacilityId(id: string): Promise<Indicator[]>;
}
