import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Facility, IDocketRepository, IFacilityRepository, IMasterFacilityRepository, Manifest } from '../../../../domain';
import { LogManifestCommand } from '../log-manifest.command';
export declare class LogManifestHandler implements ICommandHandler<LogManifestCommand> {
    private readonly masterFacilityRepository;
    private readonly docketRepository;
    private readonly facilityRepository;
    private readonly publisher;
    constructor(masterFacilityRepository: IMasterFacilityRepository, docketRepository: IDocketRepository, facilityRepository: IFacilityRepository, publisher: EventPublisher);
    execute(command: LogManifestCommand): Promise<any>;
    enrollFacility(command: LogManifestCommand): Promise<Facility>;
    createManifest(command: LogManifestCommand): Manifest;
}
