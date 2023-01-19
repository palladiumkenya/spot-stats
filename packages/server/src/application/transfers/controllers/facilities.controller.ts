import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetSummaryQuery } from '../queries/get-summary.query';
import { GetAllSummaryQuery } from './../queries/get-all-summary.query';

@Controller('facilities')
export class FacilitiesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * @description : This endpoint gets the summaries for all facilities
   */

  @Get('all')
  async getAllFacilityStats() {
    const result = await this.queryBus.execute(new GetAllSummaryQuery());
    return result;
  }

  @Get(':id')
  async getFacilityStats(@Param('id') id) {
    const result = await this.queryBus.execute(new GetSummaryQuery(id));
    return result;
  }
}
