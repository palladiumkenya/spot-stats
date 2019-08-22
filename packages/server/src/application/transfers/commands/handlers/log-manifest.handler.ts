import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  Facility,
  IDocketRepository,
  IFacilityRepository,
  IMasterFacilityRepository,
  Manifest,
} from '../../../../domain';
import * as uuid from 'uuid';
import { LogManifestCommand } from '../log-manifest.command';
import { plainToClass } from 'class-transformer';

@CommandHandler(LogManifestCommand)
export class LogManifestHandler implements ICommandHandler<LogManifestCommand> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly masterFacilityRepository: IMasterFacilityRepository,
    @Inject('IDocketRepository')
    private readonly docketRepository: IDocketRepository,
    @Inject('IFacilityRepository')
    private readonly facilityRepository: IFacilityRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: LogManifestCommand): Promise<any> {
    // check if manifest Exists
    const manifestExists = await this.facilityRepository.manifestExists(
      command.id,
    );

    if (manifestExists) {
      return;
    }

    // check or enroll Facility
    const facility = await this.enrollFacility(command);

    if (!facility) {
      return;
    }

    // log manifest
    facility.addManifest(this.createManifest(command));

    const updatedFacility = await this.facilityRepository.update(facility);
    this.publisher.mergeObjectContext(facility).commit();
    return updatedFacility;
  }

  async enrollFacility(command: LogManifestCommand): Promise<Facility> {
    const facility = await this.facilityRepository.findByCode(
      command.facilityCode,
    );

    if (facility) {
      return plainToClass(Facility, facility);
    }

    const newFacility = new Facility(
      uuid.v1(),
      command.facilityCode,
      command.facilityName,
    );
    const enrolledFacility = await this.facilityRepository.create(newFacility);
    this.publisher.mergeObjectContext(newFacility).commit();
    return newFacility;
  }

  createManifest(command: LogManifestCommand): Manifest {
    const manifest = new Manifest(
      command.id,
      command.logDate,
      command.buildDate,
      command.docket,
      command.patientCount,
      command.cargo,
    );
    return manifest;
  }
}
