import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@nestjs-plus/rabbitmq';
import { ConfigService } from '../../config/config.service';
import { CommandBus } from '@nestjs/cqrs';
import { LogManifestCommand } from '../../application/transfers/commands/log-manifest.command';
import { UpdateStatsCommand } from '../../application/transfers/commands/update-stats.command';
import { manifestSchema } from '../transfers';
import { plainToClass } from 'class-transformer';
import { Manifest } from '../../domain';
import { InitializeSummariesCommand } from '../../application/transfers/commands/initialize-summaries-command';

@Injectable()
export class MessagingService {
  constructor(
    private readonly config: ConfigService,
    private readonly amqpConnection: AmqpConnection,
    private readonly commandBus: CommandBus,
  ) {}

  public async publish(
    message: any,
    exchange: string,
    route: string,
  ): Promise<boolean> {
    try {
      await this.amqpConnection.publish(exchange, route, message);
      return true;
    } catch (e) {
      return false;
    }
  }

  @RabbitSubscribe({
    exchange: 'stats.exchange',
    routingKey: 'manifest.route',
    queue: 'manifest.queue',
  })
  public async subscribeToManifest(data: any) {
    const manifest = JSON.parse(data);
    Logger.log(`+++++++++++ ${manifest.docket} +++++++++`);
    Logger.log(`Received Manifest  ${manifest.facilityName}`);

    await this.commandBus.execute(
      new LogManifestCommand(
        manifest.id,
        manifest.facilityCode,
        manifest.facilityName,
        manifest.docket,
        manifest.logDate,
        manifest.buildDate,
        manifest.patientCount,
        manifest.cargo,
        true,
      ),
    );
  }

  @RabbitSubscribe({
    exchange: 'stats.exchange',
    routingKey: 'stats.route',
    queue: 'stats.queue',
  })
  public async subscribeToStats(data: any) {
    const stats = JSON.parse(data);
    Logger.log(`+++++++++++ ${stats.docket} +++++++++`);
    Logger.log(`Received Stats  ${stats.facilityCode}`);
    await this.commandBus.execute(
      new UpdateStatsCommand(
        stats.facilityCode,
        stats.docket,
        stats.stats,
        stats.updated,
        stats.manifestId,
      ),
    );
  }
}
