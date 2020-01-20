import { IRepository } from '../../application/common';
import { Metric } from './metric';

export interface IMetricRepository extends IRepository<Metric> {
  findByMetricId(id: string): Promise<Metric>;
  findByFacilityId(id: string): Promise<Metric[]>;
  updateCurrent(facilityId: string, measureId: string): Promise<any>;
}
