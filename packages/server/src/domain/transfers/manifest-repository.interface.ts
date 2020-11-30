import { IRepository } from '../../application/common/repository.interface';
import { Manifest } from './manifest';
import { MasterFacility } from '..';

export interface IManifestRepository extends IRepository<Manifest> {
  manifestExists(mId: string): Promise<boolean>;
  getCurrent(facId?: string): Promise<any>;
  getCurrentDocket(facId: string, docketId: string): Promise<any>;
  getAllCurrentPaged(
    size: number,
    page: number,
    sort?: any,
    filter?: any,
  ): Promise<any>;
  getCurrentMissing(): Promise<any>;
  updateCurrent(code: number): Promise<any>;
}
