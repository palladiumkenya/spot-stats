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
      .find({ facility: id, isCurrent: true })
      .populate('measure')
      .exec();
    return result;
  }

  async updateCurrent(facilityId: string, measureId: string): Promise<any> {
    await this.model.updateMany(
      { facility: facilityId, measure: measureId, isCurrent: true },
      { isCurrent: false },
    );

    const latest = await this.model
      .find({ facility: facilityId, measure: measureId })
      .sort({ reportDate: -1 })
      .limit(1);

    if (latest && latest.length > 0) {
      latest[0].isCurrent = true;
      await this.update(latest[0]);
    }
  }
}
