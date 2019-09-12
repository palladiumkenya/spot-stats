import { Controller, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetStatsQuery } from '../queries/get-stats.query';

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
}
