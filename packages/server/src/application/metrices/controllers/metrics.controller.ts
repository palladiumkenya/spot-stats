import {Controller, Get, Logger, Param, Post} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetMetricQuery } from '../queries/get-metric.query';
import {LogIndicatorCommand} from '../commands/log-indicator.command';

@Controller('facmetrics')
export class MetricsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  async getFacilityMetrics(@Param('id') id) {
    const result = await this.queryBus.execute(new GetMetricQuery(id));
    return result;
  }

  @Post()
  async createNewIndicator() {
    await this.commandBus.execute(new LogIndicatorCommand('1', 'TX_CURR', '1500', new Date(), 'EMR', 'maragua', '5'));
  }
}
