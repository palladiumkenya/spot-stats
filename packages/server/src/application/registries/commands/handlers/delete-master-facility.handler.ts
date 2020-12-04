import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IMasterFacilityRepository } from '../../../../domain/registries/master-facility-repository.interface';
import { DeleteMasterFacilityCommand } from '../delete-master-facility.command';
import { MasterFacilityDeletedEvent } from '../../events/master-facility-deleted.event';

@CommandHandler(DeleteMasterFacilityCommand)
export class DeleteMasterFacilityHandler
  implements ICommandHandler<DeleteMasterFacilityCommand> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly repository: IMasterFacilityRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteMasterFacilityCommand): Promise<boolean> {
    const result = await this.repository.delete(command._id);
    if (result) {
      this.eventBus.publish(new MasterFacilityDeletedEvent(command._id));
      return true;
    }
    return false;
  }
}
