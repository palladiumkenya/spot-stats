import { IRepository } from '../../application/common/repository.interface';
import { Manifest } from './manifest';

export interface IManifestRepository extends IRepository<Manifest> {
  manifestExists(mId: string): Promise<boolean>;
  getCurrent(): Promise<any>;
}
