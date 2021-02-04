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
    return await this.commandBus.execute(new LogIndicatorCommand('1', 13929,
        'Nyang\'oma Mission Health Centre', 'TX_CURR', '1500', new Date(), 'EMR', '5'));
  }

  @Post('updateIndicator')
  async updateIndicator() {
    return await this.commandBus.execute(new LogIndicatorCommand('1', 13929, 'Nyang\'oma Mission Health Centre',
        'TX_CURR', '1500', new Date(), 'DWH', '5', '1000', new Date()));
  }

  @Get('getIndicatorsByFacilityId/:id')
  async getIndicatorsByFacilityId(@Param('id') id) {
    return await this.queryBus.execute(new GetIndicatorQuery(id));
  }
}
