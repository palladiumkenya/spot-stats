import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { IMasterFacilityRepository } from '../../../../domain/registries/master-facility-repository.interface';
import { UpdateFacilityCommand } from '../update-facility.command';

@CommandHandler(UpdateFacilityCommand)
export class UpdateFacilityHandler
  implements ICommandHandler<UpdateFacilityCommand> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly repository: IMasterFacilityRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateFacilityCommand): Promise<number> {
    return await this.repository.updateFacility(command.facilities);
  }
}
