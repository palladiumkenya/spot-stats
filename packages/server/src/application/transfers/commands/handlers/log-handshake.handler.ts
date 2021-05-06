import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  Facility,
  IDocketRepository,
  IFacilityRepository,
  IMasterFacilityRepository,
  Manifest,
} from '../../../../domain';
import * as uuid from 'uuid';
import { LogManifestCommand } from '../log-manifest.command';
import { plainToClass } from 'class-transformer';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
import { MasterFacilityRepository } from '../../../../infrastructure/registries';
import { ManifestLoggedEvent } from '../../events/manifest-logged.event';
import { LogHandshakeCommand } from '../log-handshake.command';
import { HandshakeLoggedEvent } from '../../events/handshake-logged.event';

@CommandHandler(LogHandshakeCommand)
export class LogHandshakeHandler
  implements ICommandHandler<LogHandshakeCommand> {
  constructor(
      @Inject('IMasterFacilityRepository')
      private readonly masterFacilityRepository: IMasterFacilityRepository,
      @Inject('IDocketRepository')
      private readonly docketRepository: IDocketRepository,
      @Inject('IFacilityRepository')
      private readonly facilityRepository: IFacilityRepository,
      @Inject('IManifestRepository')
      private readonly manifestRepository: IManifestRepository,
      private readonly publisher: EventPublisher,
      private readonly eventBus: EventBus,
  ) {
  }

  async execute(command: LogHandshakeCommand): Promise<any> {
    const manifestExists = await this.manifestRepository.getByManifestId(command.id);
    if (!manifestExists) {
      return;
    }
    const manifest = plainToClass(Manifest, manifestExists);
    if (manifest.hasSession()) {
      manifest.endSession(command.end);
    } else {
      manifest.createSession(
          command.session,
          command.start,
          command.end,
          command.tag,
      );
    }
    await this.manifestRepository.update(manifest);
    Logger.log(`Manifest handshake processed ${manifest.facility}`);
    this.eventBus.publish(new HandshakeLoggedEvent(manifest._id));
    return manifest;
  }
}
