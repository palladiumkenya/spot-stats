import { EventPublisher, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
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
import { ReInitializeAllSummariesQuery } from '../re-initialize-all-summaries.query';

@QueryHandler(ReInitializeAllSummariesQuery)
export class ReInitializeAllSummariesHandler
  implements IQueryHandler<ReInitializeAllSummariesQuery, any> {
  constructor(
    @Inject('IFacilityRepository')
    private readonly facilityRepository: IFacilityRepository,
    @Inject('IDocketRepository')
    private readonly docketRepository: IDocketRepository,
    @Inject('IManifestRepository')
    private readonly manifestRepository: IManifestRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(query: ReInitializeAllSummariesQuery): Promise<any> {
    Logger.log(`Summaries re-initialize start`);
    let facilities = await this.facilityRepository.findAll();

    for (let i = 0; i < facilities.length; i++) {
      if (!facilities[i].code) continue;
      let facility = await this.facilityRepository.findByCode(
        facilities[i].code,
      );

      if (facility) {
        facility = plainToClass(Facility, facility);
        const currentManifest = await this.manifestRepository.getCurrentDocket(
          facility._id,
          'NDWH',
        );

        if (!currentManifest) {
          continue;
        }

        const manifest = await this.manifestRepository.get(currentManifest._id);

        if (manifest) {
          let docket = await this.docketRepository.findByName(manifest.docket);

          if (docket && docket.extracts && docket.extracts.length > 0) {
            docket = plainToClass(Docket, docket);
            const extracts = docket.extracts.sort((a, b) => a.rank - b.rank);
            extracts.forEach(e => {
              if (!facility.summaryHasExtract(e._id)) {
                const summary = new Summary(
                  {
                    id: docket._id,
                    name: docket.name,
                    display: docket.display,
                  },
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
                  facility.resetSummary(
                    e._id,
                    manifest.patientCount,
                    new Date(),
                  );
                } else {
                  facility.resetSummary(
                    e._id,
                    this.getExpected(manifest, docket, e),
                    new Date(),
                  );
                }
              }
            });
            const updatedFacility = await this.facilityRepository.update(
              facility,
            );
            Logger.log(`Summaries ${facility.name} re-initialized`);
            this.publisher.mergeObjectContext(facility).commit();
          }
        }
      }
    }
    return facilities;
  }

  private setExpected(summary: Summary, manifest: any, docket: any, e: any) {
    summary.expected = this.getExpected(manifest, docket, e);
  }

  private getExpected(manifest: any, docket: any, e: any) {
    try {
      if (manifest.cargo) {
        const cargoes = JSON.parse(manifest.cargo);
        const stats = cargoes.filter(
          c =>
            (c.name === e.name ||
              c.name === e.name.replace('Extract', '') ||
              c.name === `${e.name}Extract`) &&
            c.docketId === docket.name,
        )[0];
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
