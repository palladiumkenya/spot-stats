import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Metric } from '../../domain/metrices/metric';
import { metricSchema } from './schemas/metric.schema';
import { MetricRepository } from './metric.repository';
import { Measure } from '../../domain/metrices/measure';
import { measureSchema } from './schemas/measure.schema';
import { MeasureRepository } from './measure.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Metric.name, schema: metricSchema }]),
    MongooseModule.forFeature([{ name: Measure.name, schema: measureSchema }]),
  ],
  providers: [
    { provide: 'IMetricRepository', useClass: MetricRepository },
    { provide: 'IMeasureRepository', useClass: MeasureRepository },
  ],
  exports: [
    { provide: 'IMetricRepository', useClass: MetricRepository },
    { provide: 'IMeasureRepository', useClass: MeasureRepository },
  ],
})
export class MetricsInfrastructureModule {}
