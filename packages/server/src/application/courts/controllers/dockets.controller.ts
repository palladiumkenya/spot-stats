import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SaveDocketCommand } from '../commands/save-docket.command';
import { GetDocketsQuery } from '../queries/get-dockets.query';
import { DeleteDocketCommand } from '../commands/delete-docket.command';
import { DocketDto } from '../../../domain/courts/dtos/docket.dto';

@Controller('dockets')
export class DocketsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getDockets(): Promise<any> {
    return this.queryBus.execute(new GetDocketsQuery());
  }

  @Post()
  async createOrUpdateDocket(@Body() docket: DocketDto) {
    return this.commandBus.execute(
      new SaveDocketCommand(docket.name, docket.display, docket._id),
    );
  }

  @Delete(':_id')
  async deleteDocket(@Param('id') id) {
    return this.commandBus.execute(new DeleteDocketCommand(id));
  }
}
