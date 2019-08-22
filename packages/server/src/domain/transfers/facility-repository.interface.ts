import { IRepository } from '../../application/common/repository.interface';
import { Facility } from './facility';

export interface IFacilityRepository extends IRepository<Facility> {
  findByCode(code: number): Promise<Facility>;
  manifestExists(id: string): Promise<boolean>;
}
