import {Controller, Get, Logger, Param, Post} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetMetricQuery } from '../queries/get-metric.query';
import {LogIndicatorCommand} from '../commands/log-indicator.command';
import {GetIndicatorQuery} from "../queries/get-indicator.query";

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
    await this.commandBus.execute(new LogIndicatorCommand('1', 13455, 'maragua', 'TX_CURR', '1500', new Date(), 'EMR', '5'));
  }

  @Get('getIndicatorsByFacilityId/:id')
  async getIndicatorsByFacilityId(@Param('id') id) {
    return await this.queryBus.execute(new GetIndicatorQuery(id));
  }
}
