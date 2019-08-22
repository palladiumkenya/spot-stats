import { EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDocketCommand } from '../delete-docket.command';
import { IDocketRepository } from '../../../../domain/courts/docket-repository.interface';
export declare class DeleteDocketHandler implements ICommandHandler<DeleteDocketCommand> {
    private readonly repository;
    private readonly eventBus;
    constructor(repository: IDocketRepository, eventBus: EventBus);
    execute(command: DeleteDocketCommand): Promise<boolean>;
}
