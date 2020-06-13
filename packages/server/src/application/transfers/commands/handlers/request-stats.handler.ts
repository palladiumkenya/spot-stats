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
  ) {}

  async execute(command: RequestStatsCommand): Promise<any> {
    let manifests = [];
    manifests = await this.manifestRepository.getCurrentMissing();
    if (command.facilityCodes && command.facilityCodes.length > 0) {
      manifests = manifests.filter((x) =>
        command.facilityCodes.includes(x.code),
      );
    }
    for (const manifest of manifests) {
      try {
        const result = await this.client.publish(
          JSON.stringify({
            label: RequestStatsCommand.name,
            body: {
              id: manifest.mId,
              code: manifest.code,
              docket: manifest.docket,
            },
          }),
          this.config.QueueStatsExchange,
          this.config.getRoute('syncstats.route'),
        );
      } catch (e) {
        Logger.error(`PUBLISH`, e);
      }
    }
    return manifests;
  }
}
