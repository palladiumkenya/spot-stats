import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetMasterFacilitiesQuery } from '../queries/get-master-facilities.query';
import { MasterFacilityDto } from '../../../domain/registries/dtos/master-facility.dto';
import { SaveMasterFacilityCommand } from '../commands/save-master-facility.command';
import { DeleteMasterFacilityCommand } from '../commands/delete-master-facility.command';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { MasterFacility } from '../../../domain';

@Controller('masterfacilities')
export class MasterFacilitiesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getMasterFacilities(): Promise<any> {
    return this.queryBus.execute(new GetMasterFacilitiesQuery());
  }

  @Post()
  async createOrUpdateMasterFacility(@Body() docket: MasterFacilityDto) {
    return this.commandBus.execute(
      new SaveMasterFacilityCommand(
        docket.code,
        docket.name,
        docket._id,
        docket.county,
        docket.mechanism,
      ),
    );
  }

  @Delete(':_id')
  async deleteMasterFacility(@Param('id') id) {
    return this.commandBus.execute(new DeleteMasterFacilityCommand(id));
  }
  @EventPattern('FacilityUpdatedEvent')
  async handleUpdated(data: any) {
    Logger.log(`Recieved Updates ${data}`);
    return await this.commandBus.execute(
      new SaveMasterFacilityCommand(
        data._id,
        data.code,
        data.name,
        data.county,
        data.mechanism,
      ),
    );
  }

  @EventPattern('FacilityCreatedEvent ')
  async handleCreated(data: any) {
    Logger.log(`Recieved New ${data}`);
    return await this.commandBus.execute(
      new SaveMasterFacilityCommand(
        data._id,
        data.code,
        data.name,
        data.county,
        data.mechanism,
      ),
    );
  }
}
