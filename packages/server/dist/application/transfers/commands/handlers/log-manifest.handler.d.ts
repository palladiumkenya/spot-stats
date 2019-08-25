import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Facility, IDocketRepository, IFacilityRepository, IMasterFacilityRepository, Manifest } from '../../../../domain';
import { LogManifestCommand } from '../log-manifest.command';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
export declare class LogManifestHandler implements ICommandHandler<LogManifestCommand> {
    private readonly masterFacilityRepository;
    private readonly docketRepository;
    private readonly facilityRepository;
    private readonly manifestRepository;
    private readonly publisher;
    constructor(masterFacilityRepository: IMasterFacilityRepository, docketRepository: IDocketRepository, facilityRepository: IFacilityRepository, manifestRepository: IManifestRepository, publisher: EventPublisher);
    execute(command: LogManifestCommand): Promise<any>;
    enrollFacility(command: LogManifestCommand): Promise<Facility>;
    createManifest(command: LogManifestCommand): Manifest;
}
