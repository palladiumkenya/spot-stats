import {BaseRepository} from '../common';
import {Indicator} from '../../domain/metrices/indicator';
import {IIndicatorRepository} from '../../domain/metrices/indicator-repository.interface';
import {InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Logger} from '@nestjs/common';

export class IndicatorRepository extends BaseRepository<Indicator> implements IIndicatorRepository {
    constructor(@InjectModel(Indicator.name) model: Model<Indicator>) {
        super(model);
    }

    async findByFacilityId(id: string): Promise<Indicator[]> {
        const today = new Date();
        const previous_month = new Date();
        previous_month.setMonth(today.getMonth() - 1);
        previous_month.setDate(1);
        const result = await this.model
            .find({ facility: id })
            .sort({ indicatorDate: -1 });
        return result;
    }

    async findIndicatorByFacilityIdAndName(facilityId: string, indicatorName: string): Promise<Indicator[]> {
        const result = await this.model
            .find({ facility: facilityId, name: indicatorName, dwhValue: null })
            .sort({indicatorDate: -1})
            .limit(1);
        return result;
    }
}
