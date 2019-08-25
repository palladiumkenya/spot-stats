import { IRepository } from '../../application/common/repository.interface';
import { Facility } from './facility';
export interface IFacilityRepository extends IRepository<Facility> {
    getSummary(id: string): Promise<Facility>;
    findByCode(code: number): Promise<Facility>;
}
