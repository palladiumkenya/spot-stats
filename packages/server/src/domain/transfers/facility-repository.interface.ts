import { IRepository } from '../../application/common/repository.interface';
import { Facility } from './facility';
import { FacilityStatsDto } from './dtos/facility-stats.dto';

export interface IFacilityRepository extends IRepository<Facility> {
  getStats(): Promise<FacilityStatsDto[]>;
  findByCode(code: number): Promise<Facility>;
}
