import { BaseRepository } from '../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facility } from '../../domain/transfers/facility';
import { Manifest } from '../../domain';
import { IManifestRepository } from '../../domain/transfers/manifest-repository.interface';

export class ManifestRepository extends BaseRepository<Manifest>
  implements IManifestRepository {
  constructor(@InjectModel(Manifest.name) model: Model<Manifest>) {
    super(model);
  }

  async getCurrent(): Promise<any> {
    const resuls = await this.model.find({ isCurrent: true }).exec();
    return resuls;
  }
}
