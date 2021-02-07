import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, Nack, RabbitSubscribe } from '@nestjs-plus/rabbitmq';
import { ConfigService } from '../../config/config.service';
import { CommandBus } from '@nestjs/cqrs';
import { LogManifestCommand } from '../../application/transfers/commands/log-manifest.command';
import { UpdateStatsCommand } from '../../application/transfers/commands/update-stats.command';
import { LogMetricCommand } from '../../application/metrices/commands/log-metric.command';
import { LogIndicatorCommand } from '../../application/metrices/commands/log-indicator.command';
import {
  AGENCY_SYNCED,
  ALL_FACILITY_SYNCED,
  FACILITY_SYNCED,
  MECHANISM_SYNCED,
} from '../../domain/common/constants';
import { UpdateAgencyCommand } from '../../application/registries/commands/update-agency.command';
import { UpdateFacilityCommand } from '../../application/registries/commands/update-facility.command';
import { UpdateMechanismCommand } from '../../application/registries/commands/update-mechanism.command';
import { LogHandshakeCommand } from '../../application/transfers/commands/log-handshake.command';

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

    let cmd = new LogManifestCommand(
      manifest.id,
      manifest.facilityCode,
      manifest.facilityName,
      manifest.docket,
      manifest.logDate,
      manifest.buildDate,
      manifest.patientCount,
      manifest.cargo,
      true,
    );

    cmd.start = manifest.start;
    cmd.end = manifest.end;
    cmd.session = manifest.session;
    cmd.tag = manifest.tag;

    await this.commandBus.execute(cmd);
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

  @RabbitSubscribe({
    exchange: 'stats.exchange',
    routingKey: 'metric.route',
    queue: 'metric.queue',
  })
  public async subscribeToMetric(data: any) {
    const metric = JSON.parse(data);
    Logger.log(`+++++++++++++++++++++++++++++++++++++`);
    Logger.log(`Received Metric ${metric.facilityName}`);

    if (metric && metric.cargo) {
      metric.cargo = JSON.parse(metric.cargo);
    }

    await this.commandBus.execute(
      new LogMetricCommand(
        metric.id,
        metric.facilityCode,
        metric.facilityName,
        metric.cargo,
        metric.cargoType,
        metric.facilityManifestId,
      ),
    );
  }

  @RabbitSubscribe({
    exchange: 'stats.exchange',
    routingKey: 'indicator.route',
    queue: 'indicator.queue',
  })
  public async subscribeToIndicator(data: any) {
    const indicator = JSON.parse(data);
    Logger.log(`+++++++++++++++++++++++++++++++++++++`);
    Logger.log(`Received Indicator ${indicator.name}`);

    if (indicator.stage === 'EMR') {
      await this.commandBus.execute(
        new LogIndicatorCommand(
          indicator.id,
          indicator.facilityCode,
          indicator.facilityName,
          indicator.name,
          indicator.value,
          indicator.indicatorDate,
          indicator.stage,
          indicator.facilityManifestId,
        ),
      );
    } else if (indicator.stage === 'DWH') {
      await this.commandBus.execute(
        new LogIndicatorCommand(
          indicator.id,
          indicator.facilityCode,
          indicator.facilityName,
          indicator.name,
          null,
          null,
          indicator.stage,
          indicator.facilityManifestId,
          indicator.value,
          indicator.indicatorDate,
        ),
      );
    } else {
      Logger.error('unknown indicator stage');
      Logger.error(indicator);
    }
  }

  @RabbitSubscribe({
    exchange: 'globe.exchange',
    routingKey: 'practice.route',
    queue: 'practice.queue',
  })
  public async subscribeToGlobe(data: any) {
    const message = JSON.parse(data);
    const messageBody = JSON.parse(message.body);
    Logger.log(`+++++++++++ ${message.label} +++++++++`);
    if (message.label === AGENCY_SYNCED) {
      Logger.log(`syncing... Agency ${messageBody.name}`);
      await this.commandBus.execute(new UpdateAgencyCommand(messageBody));
    }
    if (message.label === MECHANISM_SYNCED) {
      Logger.log(`syncing... Mechanism ${messageBody.name}`);
      await this.commandBus.execute(new UpdateMechanismCommand(messageBody));
    }
    if (
      message.label === FACILITY_SYNCED ||
      message.label === ALL_FACILITY_SYNCED
    ) {
      Logger.log(`syncing... Facility ${messageBody.name}`);
      await this.commandBus.execute(new UpdateFacilityCommand(messageBody));
    }
  }

  @RabbitSubscribe({
    exchange: 'stats.exchange',
    routingKey: 'handshake.route',
    queue: 'handshake.queue',
  })
  public async subscribeToHandshake(data: any) {
    const manifest = JSON.parse(data);
    Logger.log(`Received Handshake  ${manifest.id}`);

    await this.commandBus.execute(
      new LogHandshakeCommand(
        manifest.id,
        manifest.end,
        manifest.start,
        manifest.session,
        manifest.tag,
      ),
    );
  }
}
