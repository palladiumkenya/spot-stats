import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetNoticesQuery } from '../queries';

@Controller('notices')
export class NoticesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getNotices(): Promise<any> {
    return this.queryBus.execute(new GetNoticesQuery());
  }
}
