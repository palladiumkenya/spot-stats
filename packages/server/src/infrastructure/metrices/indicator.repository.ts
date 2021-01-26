import {BaseRepository} from '../common';
import {Indicator} from '../../domain/metrices/indicator';
import {IIndicatorRepository} from '../../domain/metrices/indicator-repository.interface';
import {InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class IndicatorRepository extends BaseRepository<Indicator> implements IIndicatorRepository {
    constructor(@InjectModel(Indicator.name) model: Model<Indicator>) {
        super(model);
    }
}
