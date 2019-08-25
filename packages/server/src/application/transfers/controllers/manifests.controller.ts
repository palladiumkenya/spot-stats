import { Controller, Delete, Get, Logger, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern } from '@nestjs/microservices';
import { GetStatsQuery } from '../queries/get-stats.query';
import { GetSummaryQuery } from '../queries/get-summary.query';
import { LogManifestCommand } from '../commands/log-manifest.command';
import * as uuid from 'uuid';
import { UpdateStatsCommand } from '../commands/update-stats.command';

@Controller('manifests')
export class ManifestsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getStats(): Promise<any> {
    return this.queryBus.execute(new GetStatsQuery());
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
        true,
      ),
    );
  }
}
