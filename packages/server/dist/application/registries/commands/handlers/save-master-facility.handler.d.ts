import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { IMasterFacilityRepository } from '../../../../domain/registries/master-facility-repository.interface';
import { SaveMasterFacilityCommand } from '../save-master-facility.command';
export declare class SaveMasterFacilityHandler implements ICommandHandler<SaveMasterFacilityCommand> {
    private readonly repository;
    private readonly publisher;
    constructor(repository: IMasterFacilityRepository, publisher: EventPublisher);
    execute(command: SaveMasterFacilityCommand): Promise<any>;
    createMasterFacility(command: SaveMasterFacilityCommand): Promise<any>;
    updateMasterFacility(command: SaveMasterFacilityCommand): Promise<any>;
}
