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

  @Get()
  async getStats(): Promise<any> {
    return this.queryBus.execute(new GetStatsQuery());
  }
  @Get(':id')
  async getFacilityStats(@Param('id') id) {
    return this.queryBus.execute(new GetSummaryQuery(id));
  }
  @EventPattern('LogManifestEvent')
  async handleLogUpdated(data: any) {
    Logger.log(`Recieved Manifest ${data}`);
    return await this.commandBus.execute(
      new LogManifestCommand(
        data.id,
        data.facilityCode,
        data.facilityName,
        data.docket,
        data.logDate,
        data.buildDate,
        data.patientCount,
        data.cargo,
      ),
    );
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
