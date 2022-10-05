import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { IMasterFacilityRepository } from '../../../../domain/registries/master-facility-repository.interface';
import { UpdateFacilityCommand } from '../update-facility.command';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';

@CommandHandler(UpdateFacilityCommand)
export class UpdateFacilityHandler
  implements ICommandHandler<UpdateFacilityCommand> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly repository: IMasterFacilityRepository,
    @Inject('IManifestRepository')
    private readonly manifestRepository: IManifestRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateFacilityCommand): Promise<number> {
    const updated = await this.repository.updateFacility(command.facilities);
    for (const mf of updated) {
      mf.syncFacility();
      this.publisher.mergeObjectContext(mf).commit();
      try {
        await this.manifestRepository.syncManifest(mf.code, mf);
        Logger.log(`${mf.name} manifest  synced!`);
      } catch (e) {
        Logger.log(`error manifest  sync!`);
      }
    }
    return updated.length;
  }
}
