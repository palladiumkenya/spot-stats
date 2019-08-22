import { BaseRepository } from '../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDocketRepository } from '../../domain/courts/docket-repository.interface';
import { Docket } from '../../domain/courts/docket';

export class DocketRepository extends BaseRepository<Docket>
  implements IDocketRepository {
  constructor(@InjectModel(Docket.name) model: Model<Docket>) {
    super(model);
  }

  async findByName(name: string): Promise<Docket> {
    const docket = await this.model.find({ name }).exec();
    if (docket && docket.length > 0) {
      return docket[0].toObject();
    }
    return undefined;
  }
}
