import { IRepository } from '../../application/common';
import { Docket } from './docket';

export interface IDocketRepository extends IRepository<Docket> {
  findByName(name: string): Promise<Docket>;
}
