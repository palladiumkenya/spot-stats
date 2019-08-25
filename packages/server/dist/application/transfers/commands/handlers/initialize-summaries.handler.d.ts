import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InitializeSummariesCommand } from '../initialize-summaries-command';
import { IDocketRepository, IFacilityRepository } from '../../../../domain';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
export declare class InitializeSummariesHandler implements ICommandHandler<InitializeSummariesCommand> {
    private readonly facilityRepository;
    private readonly docketRepository;
    private readonly manifestRepository;
    private readonly publisher;
    constructor(facilityRepository: IFacilityRepository, docketRepository: IDocketRepository, manifestRepository: IManifestRepository, publisher: EventPublisher);
    execute(command: InitializeSummariesCommand): Promise<any>;
}
