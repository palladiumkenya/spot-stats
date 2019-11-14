import { BaseRepository } from '../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Measure } from '../../domain/metrices/measure';
import { IMeasureRepository } from '../../domain/metrices/measure-repository.interface';

export class MeasureRepository extends BaseRepository<Measure>
  implements IMeasureRepository {
  constructor(@InjectModel(Measure.name) model: Model<Measure>) {
    super(model);
  }
}
