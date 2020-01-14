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

  async manifestExists(mId: string): Promise<boolean> {
    const resuls = await this.model.findOne({ mId }).exec();
    if (resuls) {
      return true;
    }
    return false;
  }

  async getCurrent(facId?: string): Promise<any> {
    if (facId) {
      const facResuls = await this.model
        .find({ isCurrent: true, facility: facId })
        .exec();
      if (facResuls && facResuls.length > 0) {
        return facResuls[0].toObject();
      }
      return undefined;
    }
    const resuls = await this.model.find({ isCurrent: true }).exec();
    return resuls;
  }

  async updateCurrent(code: number): Promise<any> {
    await this.model.updateMany(
      { code, isCurrent: true },
      { isCurrent: false },
    );

    for (const docket of ['HTS', 'NDWH']) {
      const latest = await this.model
        .find({ code, docket })
        .sort({ logDate: -1 })
        .limit(1);

      if (latest && latest.length > 0) {
        latest[0].isCurrent = true;
        await this.update(latest[0]);
      }
    }
  }
}
