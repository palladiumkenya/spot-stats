import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InitializeSummariesCommand } from '../initialize-summaries-command';
import { IDocketRepository, IFacilityRepository } from '../../../../domain';
export declare class InitializeSummariesHandler implements ICommandHandler<InitializeSummariesCommand> {
    private readonly facilityRepository;
    private readonly docketRepository;
    private readonly publisher;
    constructor(facilityRepository: IFacilityRepository, docketRepository: IDocketRepository, publisher: EventPublisher);
    execute(command: InitializeSummariesCommand): Promise<any>;
}
