import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { IDocketRepository, IFacilityRepository } from '../../../../domain';
import { UpdateStatsCommand } from '../update-stats.command';
export declare class UpdateStatsHandler implements ICommandHandler<UpdateStatsCommand> {
    private readonly docketRepository;
    private readonly facilityRepository;
    private readonly publisher;
    constructor(docketRepository: IDocketRepository, facilityRepository: IFacilityRepository, publisher: EventPublisher);
    execute(command: UpdateStatsCommand): Promise<any>;
}
