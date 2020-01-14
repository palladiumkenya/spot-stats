import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { IMasterFacilityRepository } from '../../../../domain/registries/master-facility-repository.interface';
import { UpdateAgencyCommand } from '../update-agency.command';

@CommandHandler(UpdateAgencyCommand)
export class UpdateAgencyHandler
  implements ICommandHandler<UpdateAgencyCommand> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly repository: IMasterFacilityRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateAgencyCommand) {
    Logger.log(`updating agency ${command}`);
  }
}
