import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AssignMasterFacilityCommand } from '../assign-master-facility.command';
import { Facility, IFacilityRepository, IMasterFacilityRepository } from '../../../../domain';
export declare class AssignMasterFacilityHandler implements ICommandHandler<AssignMasterFacilityCommand> {
    private readonly masterFacilityRepository;
    private readonly facilityRepository;
    private readonly publisher;
    constructor(masterFacilityRepository: IMasterFacilityRepository, facilityRepository: IFacilityRepository, publisher: EventPublisher);
    execute(command: AssignMasterFacilityCommand): Promise<Facility>;
}
