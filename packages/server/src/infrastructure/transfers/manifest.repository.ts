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
        .populate(Facility.name.toLowerCase())
        .exec();
      if (facResuls && facResuls.length > 0) {
        return facResuls[0].toObject();
      }
      return undefined;
    }
    const resuls = await this.model
      .aggregate([
        { $match: { isCurrent: true } },
        {
          $project: {
            _id: 1,
            mId: 1,
            code: 1,
            name: 1,
            logDate: 1,
            buildDate: 1,
            docket: 1,
            patientCount: 1,
            isCurrent: 1,
            facility: {
              _id: '$facilityInfo._id',
              masterFacility: '$facilityInfo.masterFacility',
            },
            recievedCount: 1,
            recievedDate: 1,
          },
        },

        { $sort: { logDate: -1 } },
      ])
      .exec();
    return resuls;
  }

  async getCurrentDocket(facId: string, docketId: string): Promise<any> {
    if (facId) {
      const facResuls = await this.model
        .find({ isCurrent: true, facility: facId, docket: docketId })
        .populate(Facility.name.toLowerCase())
        .exec();
      if (facResuls && facResuls.length > 0) {
        return facResuls[0].toObject();
      }
      return undefined;
    }
  }

  getAllCurrentPaged(
    size: number,
    page: number,
    sort?: any,
    filter?: any,
  ): Promise<any> {
    return this.model
      .find({ isCurrent: true })
      .sort({ logDate: -1 })
      .skip(size * (page - 1))
      .limit(size)
      .exec();
  }

  async getCurrentMissing(): Promise<any> {
    const resuls = await this.model
      .find({ isCurrent: true, recievedCount: null })
      .select({
        _id: 1,
        mId: 1,
        code: 1,
        name: 1,
        logDate: 1,
        docket: 1,
        patientCount: 1,
      })
      .sort({ logDate: -1 })
      .exec();
    return resuls;
  }

  async updateCurrent(code: number): Promise<any> {
    await this.model.updateMany(
      { code, isCurrent: true },
      { isCurrent: false },
    );

    for (const docket of ['HTS', 'NDWH', 'MPI', 'MGS']) {
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
