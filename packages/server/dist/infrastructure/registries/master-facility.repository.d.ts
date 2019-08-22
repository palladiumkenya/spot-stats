import { BaseRepository } from '../common/base.repository';
import { Model } from 'mongoose';
import { IMasterFacilityRepository } from '../../domain/registries/master-facility-repository.interface';
import { MasterFacility } from '../../domain/registries/master-facility';
export declare class MasterFacilityRepository extends BaseRepository<MasterFacility> implements IMasterFacilityRepository {
    constructor(model: Model<MasterFacility>);
    findByCode(code: number): Promise<MasterFacility>;
}
