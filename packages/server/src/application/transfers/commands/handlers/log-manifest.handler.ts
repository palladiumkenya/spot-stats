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
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
import { MasterFacilityRepository } from '../../../../infrastructure/registries';

@CommandHandler(LogManifestCommand)
export class LogManifestHandler implements ICommandHandler<LogManifestCommand> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly masterFacilityRepository: IMasterFacilityRepository,
    @Inject('IDocketRepository')
    private readonly docketRepository: IDocketRepository,
    @Inject('IFacilityRepository')
    private readonly facilityRepository: IFacilityRepository,
    @Inject('IManifestRepository')
    private readonly manifestRepository: IManifestRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: LogManifestCommand): Promise<any> {
    // check if manifest Exists
    const manifestExists = await this.manifestRepository.get(command.id);

    if (manifestExists) {
      return;
    }
    // check or enroll Facility
    const facility = await this.enrollFacility(command);

    const newManifest = this.createManifest(command);
    if (facility) {
      newManifest.assignFacility(facility);
    }

    // log manifest

    const manifest = await this.manifestRepository.create(newManifest);
    this.publisher.mergeObjectContext(newManifest).commit();
    return newManifest;
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
    const masterFacility = await this.masterFacilityRepository.findByCode(
      command.facilityCode,
    );

    if (masterFacility) {
      newFacility.masterFacility = masterFacility;
    }
    const enrolledFacility = await this.facilityRepository.create(newFacility);
    this.publisher.mergeObjectContext(newFacility).commit();
    return newFacility;
  }

  createManifest(command: LogManifestCommand): Manifest {
    const manifest = new Manifest(
      command.id,
      command.facilityCode,
      command.facilityName,
      command.logDate,
      command.buildDate,
      command.docket,
      command.patientCount,
      command.cargo,
      command.isCurrent,
    );
    return manifest;
  }
}
