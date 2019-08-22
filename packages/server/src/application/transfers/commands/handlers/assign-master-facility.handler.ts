import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LogManifestCommand } from '../log-manifest.command';
import { AssignMasterFacilityCommand } from '../assign-master-facility.command';
import { Inject } from '@nestjs/common';
import {
  Facility,
  IFacilityRepository,
  IMasterFacilityRepository,
} from '../../../../domain';
import { plainToClass } from 'class-transformer';

@CommandHandler(AssignMasterFacilityCommand)
export class AssignMasterFacilityHandler
  implements ICommandHandler<AssignMasterFacilityCommand> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly masterFacilityRepository: IMasterFacilityRepository,
    @Inject('IFacilityRepository')
    private readonly facilityRepository: IFacilityRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AssignMasterFacilityCommand): Promise<Facility> {
    let facility = await this.facilityRepository.get(command._id);
    if (facility) {
      facility = plainToClass(Facility, facility);
      if (facility.masterFacility) {
        return facility;
      } else {
        const masterFacility = await this.masterFacilityRepository.findByCode(
          facility.code,
        );
        if (masterFacility) {
          facility.assignMasterFacility(masterFacility);

          const updatedFacility = await this.facilityRepository.update(
            facility,
          );
          this.publisher.mergeObjectContext(facility).commit();
          return updatedFacility;
        }
      }
    }
    return null;
  }
}
