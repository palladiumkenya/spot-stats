import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetSummaryQuery } from '../queries/get-summary.query';

@Controller('facilities')
export class FacilitiesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  async getFacilityStats(@Param('id') id) {
    const result = await this.queryBus.execute(new GetSummaryQuery(id));
    return result;
  }
}
