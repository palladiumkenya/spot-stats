import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LogManifestCommand } from '../log-manifest.command';
import { Inject, Logger } from '@nestjs/common';
import {
  Facility,
  IDocketRepository,
  IFacilityRepository,
  IMasterFacilityRepository,
} from '../../../../domain';
import { UpdateStatsCommand } from '../update-stats.command';
import { plainToClass } from 'class-transformer';

@CommandHandler(UpdateStatsCommand)
export class UpdateStatsHandler implements ICommandHandler<UpdateStatsCommand> {
  constructor(
    @Inject('IDocketRepository')
    private readonly docketRepository: IDocketRepository,
    @Inject('IFacilityRepository')
    private readonly facilityRepository: IFacilityRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateStatsCommand): Promise<any> {
    let facility = await this.facilityRepository.findByCode(
      command.facilityCode,
    );
    if (facility) {
      facility = plainToClass(Facility, facility);
      facility.updateSummary(command.docket, command.stats, command.updated);

      const updatedFacility = await this.facilityRepository.update(facility);
      this.publisher.mergeObjectContext(facility).commit();
      Logger.log(`Updated Stats ${facility.name}`);
      return updatedFacility;
    }
    return null;
  }
}
