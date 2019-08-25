import { Controller, Delete, Get, Logger, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern } from '@nestjs/microservices';
import { GetStatsQuery } from '../queries/get-stats.query';
import { GetSummaryQuery } from '../queries/get-summary.query';
import { LogManifestCommand } from '../commands/log-manifest.command';
import * as uuid from 'uuid';
import { UpdateStatsCommand } from '../commands/update-stats.command';

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
  @EventPattern('UpdateStatsEvent')
  async handleUpdateStats(data: any) {
    Logger.log(`Recieved Stats ${data}`);
    return await this.commandBus.execute(
      new UpdateStatsCommand(
        data.facilityCode,
        data.docket,
        data.stats,
        data.updated,
        data.manifestId,
      ),
    );
  }
}
