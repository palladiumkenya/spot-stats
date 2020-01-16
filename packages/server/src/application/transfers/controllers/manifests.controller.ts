import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetStatsPagedQuery } from '../queries/get-stats-paged.query';
import { GetStatsCountQuery } from '../queries/get-stats-count.query';
import { GetStatsQuery } from '../queries/get-stats.query';

@Controller('manifests')
export class ManifestsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('all')
  async getAllStats(): Promise<any> {
    const query = new GetStatsQuery();
    return this.queryBus.execute(query);
  }

  @Get('/:size/:page')
  async getStats(
    @Query('sort') sort,
    @Query('filter') filter,
    @Param('size') size: number,
    @Param('page') page: number,
  ): Promise<any> {
    const sz = Number(size) || 20;
    const pg = Number(page) || 1;
    const query = new GetStatsPagedQuery(sz, pg);
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
