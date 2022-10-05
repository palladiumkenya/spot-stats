import { BaseRepository } from '../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFacilityRepository } from '../../domain/transfers/facility-repository.interface';
import { Facility } from '../../domain/transfers/facility';
import { FacilityStatsDto } from '../../domain/transfers/dtos/facility-stats.dto';
import { Summary } from '../../domain';

export class FacilityRepository extends BaseRepository<Facility>
  implements IFacilityRepository {
  constructor(@InjectModel(Facility.name) model: Model<Facility>) {
    super(model);
  }

  async findByCode(code: number): Promise<Facility> {
    const facilty = await this.model.find({ code }).exec();
    if (facilty && facilty.length > 0) {
      return facilty[0].toObject();
    }
    return undefined;
  }

  async getSummary(id: string): Promise<Facility> {
    const result = await this.model
      .findById(id)
      .populate('manifests')
      .exec();
    if (result) {
      return result.toObject();
    }
    return null;
  }

  async getSummaryAll(): Promise<Facility> {
    const result = await this.model
      .find(
        { code: { $ne: null } },
        {
          code: 1,
          name: 1,
          summaries: 1,
          masterFacility: 1,
          _id: 0,
        },
      )
      .exec();
    if (result) {
      return result;
    }
    return null;
  }

  updateMasterFacility(code: number): Promise<Facility> {
    return undefined;
  }

  async findWithManifestByCode(code: number): Promise<Facility> {
    const facilty = await this.model.find({ code , 'manifests.0': {$exists: true}}).exec();
    if (facilty && facilty.length > 0) {
      return facilty[0].toObject();
    }
    return undefined;
  }
}
