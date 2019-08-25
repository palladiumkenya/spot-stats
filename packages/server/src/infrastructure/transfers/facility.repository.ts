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

  async getStats(): Promise<FacilityStatsDto[]> {
    const facilties = await this.model
      .find({ 'manifests.isCurrent': true })
      .exec();
    return facilties;
  }
}
