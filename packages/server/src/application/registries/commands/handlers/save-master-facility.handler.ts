import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Inject } from '@nestjs/common';
import { IMasterFacilityRepository } from '../../../../domain/registries/master-facility-repository.interface';
import { SaveMasterFacilityCommand } from '../save-master-facility.command';
import { MasterFacility } from '../../../../domain/registries/master-facility';
import * as uuid from 'uuid';

@CommandHandler(SaveMasterFacilityCommand)
export class SaveMasterFacilityHandler
  implements ICommandHandler<SaveMasterFacilityCommand> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly repository: IMasterFacilityRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SaveMasterFacilityCommand): Promise<any> {
    if (command._id && command._id !== '00000000-0000-0000-0000-000000000000') {
      return await this.updateMasterFacility(command);
    }
    return await this.createMasterFacility(command);
  }

  async createMasterFacility(command: SaveMasterFacilityCommand): Promise<any> {
    const newMasterFacility = new MasterFacility(
      command._id,
      command.code,
      command.name,
      command.county,
      command.mechanism,
    );
    if (!command._id) {
      newMasterFacility._id = uuid.v1();
    }
    const masterFacility = await this.repository.create(newMasterFacility);
    this.publisher.mergeObjectContext(newMasterFacility).commit();
    return masterFacility;
  }

  async updateMasterFacility(command: SaveMasterFacilityCommand): Promise<any> {
    const raw = await this.repository.get(command._id);
    if (raw) {
      const toUptate = plainToClass(MasterFacility, raw);
      toUptate.changeDetails(
        command.code,
        command.name,
        command.county,
        command.mechanism,
      );
      const masterFacility = await this.repository.update(toUptate);
      this.publisher.mergeObjectContext(toUptate).commit();
      return masterFacility;
    } else {
      this.createMasterFacility(command);
    }
  }
}
