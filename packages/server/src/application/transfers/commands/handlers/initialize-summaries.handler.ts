import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LogManifestCommand } from '../log-manifest.command';
import { InitializeSummariesCommand } from '../initialize-summaries-command';
import { Inject, Logger } from '@nestjs/common';
import {
  Docket,
  Facility,
  IDocketRepository,
  IFacilityRepository,
  Summary,
} from '../../../../domain';
import { plainToClass } from 'class-transformer';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';

@CommandHandler(InitializeSummariesCommand)
export class InitializeSummariesHandler
  implements ICommandHandler<InitializeSummariesCommand> {
  constructor(
      @Inject('IFacilityRepository')
      private readonly facilityRepository: IFacilityRepository,
      @Inject('IDocketRepository')
      private readonly docketRepository: IDocketRepository,
      @Inject('IManifestRepository')
      private readonly manifestRepository: IManifestRepository,
      private readonly publisher: EventPublisher,
  ) {
  }

  async execute(command: InitializeSummariesCommand): Promise<any> {
    let facility = await this.facilityRepository.get(command.facilityId);
    if (facility) {
      facility = plainToClass(Facility, facility);

      const manifest = await this.manifestRepository.get(command.manifestId);

      if (manifest) {
        let docket = await this.docketRepository.findByName(manifest.docket);

        if (docket && docket.extracts && docket.extracts.length > 0) {
          docket = plainToClass(Docket, docket);
          const extracts = docket.extracts.sort((a, b) => a.rank - b.rank);
          extracts.forEach(e => {
            if (!facility.summaryHasExtract(e._id)) {
              const summary = new Summary(
                  {id: docket._id, name: docket.name, display: docket.display},
                  e,
              );
              if (e.isPatient) {
                summary.expected = manifest.patientCount;
              } else {
                this.setExpected(summary, manifest, docket, e);
              }
              summary.recieved = 0;
              summary.updated = new Date();
              facility.addSummary(summary);
            } else {
              if (e.isPatient) {
                facility.resetSummary(e._id, manifest.patientCount, new Date());
              } else {
                facility.resetSummary(e._id, this.getExpected(manifest, docket, e), new Date());
              }
            }
          });
          const updatedFacility = await this.facilityRepository.update(
              facility,
          );
          Logger.log(`Summaries ${facility.name} initialized`);
          this.publisher.mergeObjectContext(facility).commit();
        }
      }
    }
  }

  private setExpected(summary: Summary, manifest: any, docket: any, e: any) {
    summary.expected = this.getExpected(manifest, docket, e);
  }

  private getExpected(manifest: any, docket: any, e: any) {
    try {
      if (docket.name === 'HTS') {
        e.name = e.name.replace('Extract', '');
      }
      if (manifest.cargo) {
        const cargoes = JSON.parse(manifest.cargo);
        const stats = cargoes.filter(c =>
            c.name === e.name &&
            c.docketId === docket.name)[0];
        if (stats) {
          return stats.stats;
        }
      }
    } catch (e) {
      Logger.error(e);
    }
    return null;
  }
}
