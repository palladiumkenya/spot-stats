import { BaseRepository } from '../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMetricRepository } from '../../domain/metrices/metric-repository.interface';
import { Metric } from '../../domain/metrices/metric';

export class MetricRepository extends BaseRepository<Metric>
  implements IMetricRepository {
  constructor(@InjectModel(Metric.name) model: Model<Metric>) {
    super(model);
  }

  async findByMetricId(id: string): Promise<Metric> {
    const result = await this.model
      .find({ mId: id })
      .populate('measure')
      .exec();

    if (result && result.length > 0) {
      return result[0].toObject();
    }
    return undefined;
  }

  async findByFacilityId(id: string): Promise<Metric[]> {
    const result = await this.model
      .find({ facility: id })
      .populate('measure')
      .exec();
    return result;
  }
}
