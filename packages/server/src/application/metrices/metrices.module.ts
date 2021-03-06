import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LogMetricHandler } from './commands/handlers/log-metric.handler';
import { MetricLoggedHandler } from './events/handlers/metric-logged.handler';
import { GetMetricHandler } from './queries/handlers/get-metric.handler';
import { MetricsInfrastructureModule } from '../../infrastructure/metrices/metrics-infrastructure.module';
import { CourtsInfrastructureModule } from '../../infrastructure/courts';
import { TransfersInfrastructureModule } from '../../infrastructure/transfers';
import { RegistriesInfrastructureModule } from '../../infrastructure/registries';
import { MetricsController } from './controllers/metrics.controller';
import {LogIndicatorHandler} from './commands/handlers/log-indicator.handler';
import {GetIndicatorHandler} from './queries/handlers/get-indicator.handler';

const CommandHandlers = [LogMetricHandler, LogIndicatorHandler];
const EventHandlers = [MetricLoggedHandler];
const QueryHandlers = [GetMetricHandler, GetIndicatorHandler];

@Module({
  imports: [
    CqrsModule,
    CourtsInfrastructureModule,
    TransfersInfrastructureModule,
    MetricsInfrastructureModule,
    RegistriesInfrastructureModule,
  ],
  controllers: [MetricsController],
  providers: [...CommandHandlers, ...QueryHandlers, ...EventHandlers],
})
export class MetricesModule {}
