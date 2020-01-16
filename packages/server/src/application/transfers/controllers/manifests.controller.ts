import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetStatsQuery } from '../queries/get-stats.query';
import { GetStatsCountQuery } from '../queries/get-stats-count.query';

@Controller('manifests')
export class ManifestsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/:size/:page')
  async getStats(
    @Query('sort') sort,
    @Query('filter') filter,
    @Param('size') size: number,
    @Param('page') page: number,
  ): Promise<any> {
    const sz = Number(size) || 20;
    const pg = Number(page) || 1;
    const query = new GetStatsQuery(sz, pg);
    if (sort) {
      query.sort = sort;
    }
    if (filter) {
      query.filter = filter;
    }
    return this.queryBus.execute(query);
  }

  @Get('count')
  async getStatsCount(): Promise<number> {
    return this.queryBus.execute(new GetStatsCountQuery());
  }
}
