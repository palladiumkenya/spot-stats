import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteDocketCommand } from '../delete-docket.command';
import { IDocketRepository } from '../../../../domain/courts/docket-repository.interface';
import { DocketDeletedEvent } from '../../events/docket-deleted.event';

@CommandHandler(DeleteDocketCommand)
export class DeleteDocketHandler
  implements ICommandHandler<DeleteDocketCommand> {
  constructor(
    @Inject('IDocketRepository')
    private readonly repository: IDocketRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteDocketCommand): Promise<boolean> {
    const result = await this.repository.delete(command._id);
    if (result) {
      this.eventBus.publish(new DocketDeletedEvent(command._id));
      return true;
    }
    return false;
  }
}
