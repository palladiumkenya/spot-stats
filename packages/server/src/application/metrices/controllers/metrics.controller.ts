import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetMetricQuery } from '../queries/get-metric.query';

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
}
