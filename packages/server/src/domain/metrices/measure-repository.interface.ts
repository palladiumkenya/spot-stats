import { IRepository } from '../../application/common';
import { Measure } from './measure';

export interface IMeasureRepository extends IRepository<Measure> {
  getByName(area: string, name: string): Promise<Measure>;
}
