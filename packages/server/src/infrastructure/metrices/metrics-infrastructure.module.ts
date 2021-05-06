import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Metric } from '../../domain/metrices/metric';
import { metricSchema } from './schemas/metric.schema';
import { MetricRepository } from './metric.repository';
import { Measure } from '../../domain/metrices/measure';
import { measureSchema } from './schemas/measure.schema';
import { MeasureRepository } from './measure.repository';
import {Indicator} from '../../domain/metrices/indicator';
import {indicatorSchema} from './schemas/indicator.schema';
import {IndicatorRepository} from './indicator.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Metric.name, schema: metricSchema }]),
    MongooseModule.forFeature([{ name: Measure.name, schema: measureSchema }]),
    MongooseModule.forFeature([{ name: Indicator.name, schema: indicatorSchema }]),
  ],
  providers: [
    { provide: 'IMetricRepository', useClass: MetricRepository },
    { provide: 'IMeasureRepository', useClass: MeasureRepository },
    { provide: 'IIndicatorRepository', useClass: IndicatorRepository },
  ],
  exports: [
    { provide: 'IMetricRepository', useClass: MetricRepository },
    { provide: 'IMeasureRepository', useClass: MeasureRepository },
    { provide: 'IIndicatorRepository', useClass: IndicatorRepository },
  ],
})
export class MetricsInfrastructureModule {}
