import { BaseRepository } from '../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMasterFacilityRepository } from '../../domain/registries/master-facility-repository.interface';
import { MasterFacility } from '../../domain/registries/master-facility';

export class MasterFacilityRepository extends BaseRepository<MasterFacility>
  implements IMasterFacilityRepository {
  constructor(@InjectModel(MasterFacility.name) model: Model<MasterFacility>) {
    super(model);
  }

  async findByCode(code: number): Promise<MasterFacility> {
    const facilty = await this.model.find({ code }).exec();
    if (facilty && facilty.length > 0) {
      return facilty[0].toObject();
    }
    return undefined;
  }
}
