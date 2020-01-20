import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { IMasterFacilityRepository } from '../../../../domain/registries/master-facility-repository.interface';
import { UpdateMechanismCommand } from '../update-mechanism.command';

@CommandHandler(UpdateMechanismCommand)
export class UpdateMechanismHandler
  implements ICommandHandler<UpdateMechanismCommand> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly repository: IMasterFacilityRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateMechanismCommand): Promise<number> {
    return await this.repository.updateMechanism(command.mechanisms);
  }
}
