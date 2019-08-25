import { BaseRepository } from '../common/base.repository';
import { Model } from 'mongoose';
import { IFacilityRepository } from '../../domain/transfers/facility-repository.interface';
import { Facility } from '../../domain/transfers/facility';
export declare class FacilityRepository extends BaseRepository<Facility> implements IFacilityRepository {
    constructor(model: Model<Facility>);
    findByCode(code: number): Promise<Facility>;
    getSummary(id: string): Promise<Facility>;
}
