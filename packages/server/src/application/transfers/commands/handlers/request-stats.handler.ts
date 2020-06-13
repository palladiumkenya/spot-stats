import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
import { RequestStatsCommand } from '../request-stats.command';
import { MessagingService } from '../../../../infrastructure/messging/messaging.service';
import { ConfigService } from '../../../../config/config.service';

@CommandHandler(RequestStatsCommand)
export class RequestStatsHandler
  implements ICommandHandler<RequestStatsCommand> {
  constructor(
    @Inject('IManifestRepository')
    private readonly manifestRepository: IManifestRepository,
    private readonly client: MessagingService,
    private readonly config: ConfigService,
  ) {
  }

  async execute(command: RequestStatsCommand): Promise<any> {
    let manifests = [];
    manifests = await this.manifestRepository.getCurrentMissing();
    if (command.facilityCode) {
      manifests = manifests.filter((x) => x.code === command.facilityCode);
    }
    for (const manifest of manifests) {
      try {
        const result = await this.client.publish(
          JSON.stringify({ manifest.mId, manifest.code }),
          this.config.QueueStatsExchange,
          this.config.getRoute(''),
        );
      } catch (e) {
        Logger.error(`PUBLISH`, e);
      }
    }
    return manifests;
  }
}
