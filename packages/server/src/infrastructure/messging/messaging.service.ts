import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@nestjs-plus/rabbitmq';
import { ConfigService } from '../../config/config.service';
import { CommandBus } from '@nestjs/cqrs';
import { LogManifestCommand } from '../../application/transfers/commands/log-manifest.command';
import { UpdateStatsCommand } from '../../application/transfers/commands/update-stats.command';

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
    Logger.log(`+++++++++++ ${data.docket} +++++++++`);
    Logger.log(`Received Manifest  ${data.facilityName}`);
    await this.commandBus.execute(
      new LogManifestCommand(
        data.id,
        data.facilityCode,
        data.facilityName,
        data.docket,
        data.logDate,
        data.buildDate,
        data.patientCount,
        data.cargo,
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
    Logger.log(`+++++++++++ ${data.docket} +++++++++`);
    Logger.log(`Received Stats  ${data.facilityCode}`);
    await this.commandBus.execute(
      new UpdateStatsCommand(
        data.facilityCode,
        data.docket,
        data.stats,
        data.updated,
        data.manifestId,
      ),
    );
  }
}
