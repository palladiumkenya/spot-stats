import { IRepository } from '../../application/common/repository.interface';
import { Manifest } from './manifest';

export interface IManifestRepository extends IRepository<Manifest> {
  manifestExists(mId: string): Promise<boolean>;
  getCurrent(facId?: string): Promise<any>;
  getAllCurrentPaged(
    size: number,
    page: number,
    sort?: any,
    filter?: any,
  ): Promise<any>;
  updateCurrent(code: number): Promise<any>;
}
