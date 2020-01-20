import { BaseRepository } from '../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMasterFacilityRepository } from '../../domain/registries/master-facility-repository.interface';
import { MasterFacility } from '../../domain/registries/master-facility';
import { plainToClass } from 'class-transformer';

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

  async updateAgency(agencies: any[]): Promise<number> {
    let ups = 0;

    for (const a of agencies) {
      const facs = await this.model
        .find({ 'mechanism.agency._id': a._id })
        .lean();
      if (facs && facs.length > 0) {
        for (const fac of facs) {
          fac.mechanism.agency = a;
          const update = await this.update(fac);
          ups++;
        }
      }
    }
    return ups;
  }

  async updateFacility(facilities: any[]): Promise<MasterFacility[]> {
    const ups: MasterFacility[] = [];
    for (const f of facilities) {
      const facs = await this.model.find({ _id: f._id }).lean();
      if (facs && facs.length > 0) {
        for (const ff of facs) {
          const fac = plainToClass(MasterFacility, ff);
          fac.changeFacDetails(f);
          const update = await this.update(fac);
          ups.push(fac);
        }
      } else {
        const newFac = await this.create(f);
        newFac.syncFacility();
        ups.push(newFac);
      }
    }
    return ups;
  }

  async updateMechanism(mechanisms: any[]): Promise<number> {
    let ups = 0;

    for (const m of mechanisms) {
      const facs = await this.model.find({ 'mechanism._id': m._id }).lean();
      if (facs && facs.length > 0) {
        for (const ff of facs) {
          const fac = plainToClass(MasterFacility, ff);
          fac.changeMechanism(m);
          const update = await this.update(fac);
          ups++;
        }
      }
    }
    return ups;
  }
}
