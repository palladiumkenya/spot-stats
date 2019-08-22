import { EventBus, ICommandHandler } from '@nestjs/cqrs';
import { IMasterFacilityRepository } from '../../../../domain/registries/master-facility-repository.interface';
import { DeleteMasterFacilityCommand } from '../delete-master-facility.command';
export declare class DeleteMasterFacilityHandler implements ICommandHandler<DeleteMasterFacilityCommand> {
    private readonly repository;
    private readonly eventBus;
    constructor(repository: IMasterFacilityRepository, eventBus: EventBus);
    execute(command: DeleteMasterFacilityCommand): Promise<boolean>;
}
