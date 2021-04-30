import {
  CommandBus,
  CommandHandler,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { LogManifestCommand } from '../log-manifest.command';
import {CACHE_MANAGER, Inject, Logger} from '@nestjs/common';
import {
  Facility,
  IDocketRepository,
  IFacilityRepository,
  IMasterFacilityRepository,
} from '../../../../domain';
import { UpdateStatsCommand } from '../update-stats.command';
import { plainToClass } from 'class-transformer';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
import {InitializeSummariesCommand} from '../initialize-summaries-command';
import {Cache} from 'cache-manager';

@CommandHandler(UpdateStatsCommand)
export class UpdateStatsHandler implements ICommandHandler<UpdateStatsCommand> {
  constructor(
      @Inject('IDocketRepository')
      private readonly docketRepository: IDocketRepository,
      @Inject('IFacilityRepository')
      private readonly facilityRepository: IFacilityRepository,
      @Inject('IManifestRepository')
      private readonly manifestRepository: IManifestRepository,
      private readonly publisher: EventPublisher,
      private readonly commandBus: CommandBus,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
  }

  async execute(command: UpdateStatsCommand): Promise<any> {
    let facility = await this.facilityRepository.findByCode(
        command.facilityCode,
    );
    if (facility) {
      facility = plainToClass(Facility, facility);

      const currentManifest = await this.manifestRepository.getCurrentDocket(
          facility._id,
          command.docket.name,
      );

      if (!currentManifest) {
          return null;
      }

        // TODO:CHECK NEED TO REINTSUMMARIES
      if (!facility.hasSummaries()) {
        await this.commandBus.execute(
            new InitializeSummariesCommand(facility._id, currentManifest._id),
        );

        const fac = await this.facilityRepository.findByCode(
            command.facilityCode,
        );
        facility = plainToClass(Facility, fac);
      } else {

        if (!facility.hasDocketSummaries(command.docket.name)) {
          await this.commandBus.execute(
              new InitializeSummariesCommand(facility._id, currentManifest._id),
          );

          const fac = await this.facilityRepository.findByCode(
              command.facilityCode,
          );
          facility = plainToClass(Facility, fac);
        }
      }

      facility.updateSummary(command.docket, command.stats, command.updated);

      const updatedFacility = await this.facilityRepository.update(facility);
      this.publisher.mergeObjectContext(facility).commit();
      Logger.log(`Updated Stats ${facility.name}`);

      const manifest = await this.manifestRepository.getCurrentDocket(
          facility._id,
          command.docket.name,
      );
      if (manifest) {
        const recieved = facility.getPatientSummary(command.docket.name);
        if (recieved) {
          manifest.recievedCount = recieved;
          manifest.recievedDate = command.updated;
          await this.manifestRepository.update(manifest);
        }
      }
      return updatedFacility;
    }
    return null;
  }
}
