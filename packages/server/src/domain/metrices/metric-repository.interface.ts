import { IRepository } from '../../application/common';
import { Metric } from './metric';

export interface IMetricRepository extends IRepository<Metric> {
  findByMetricId(id: string): Promise<Metric[]>;
  findById(id: string): Promise<Metric[]>;
}
