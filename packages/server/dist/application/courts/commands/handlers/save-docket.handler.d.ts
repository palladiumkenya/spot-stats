import { SaveDocketCommand } from '../save-docket.command';
import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { IDocketRepository } from '../../../../domain/courts/docket-repository.interface';
export declare class SaveDocketHandler implements ICommandHandler<SaveDocketCommand> {
    private readonly repository;
    private readonly publisher;
    constructor(repository: IDocketRepository, publisher: EventPublisher);
    execute(command: SaveDocketCommand): Promise<any>;
    createDocket(command: SaveDocketCommand): Promise<any>;
    updateDocket(command: SaveDocketCommand): Promise<any>;
}
