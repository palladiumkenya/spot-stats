import { BaseRepository } from '../common/base.repository';
import { Model } from 'mongoose';
import { IDocketRepository } from '../../domain/courts/docket-repository.interface';
import { Docket } from '../../domain/courts/docket';
export declare class DocketRepository extends BaseRepository<Docket> implements IDocketRepository {
    constructor(model: Model<Docket>);
    findByName(name: string): Promise<Docket>;
}
