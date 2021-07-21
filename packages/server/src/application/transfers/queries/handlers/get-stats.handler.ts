import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
import { GetStatsQuery } from '../get-stats.query';
import {plainToClass} from 'class-transformer';
import {ManifestDto} from '../../../../domain/transfers/dtos/manifest.dto';
import * as moment from 'moment';

@QueryHandler(GetStatsQuery)
export class GetStatsHandler implements IQueryHandler<GetStatsQuery, ManifestDto[]> {
  constructor(
      @Inject('IManifestRepository')
      private readonly repository: IManifestRepository,
  ) {
  }

  async execute(query: GetStatsQuery): Promise<ManifestDto[]> {
    const data = await this.repository.getCurrent();
    const manifests: ManifestDto[] = data;
    manifests.forEach(m => {
      m.handshakeStatus = '';
      if (m.session) {
        m.handshakeStatus = 'In Progress';
        if (m.end) {
          m.handshakeStatus = 'Complete';
        } else {
          if (m.start) {
            const today = moment(new Date());
            const sent = moment(m.start);
            const diffDays = today.diff(sent, 'hours');
            if (diffDays > 3) {
              m.handshakeStatus = 'Incomplete';
            }
          }
        }
      }
    });
    return manifests;
  }
}
