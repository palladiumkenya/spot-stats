import { SaveDocketCommand } from '../save-docket.command';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { Inject } from '@nestjs/common';
import { IDocketRepository } from '../../../../domain/courts/docket-repository.interface';
import { Docket } from '../../../../domain/courts/docket';
@CommandHandler(SaveDocketCommand)
export class SaveDocketHandler implements ICommandHandler<SaveDocketCommand> {
  constructor(
    @Inject('IDocketRepository')
    private readonly repository: IDocketRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SaveDocketCommand): Promise<any> {
    if (command._id && command._id !== '00000000-0000-0000-0000-000000000000') {
      return await this.updateDocket(command);
    }

    return await this.createDocket(command);
  }

  async createDocket(command: SaveDocketCommand): Promise<any> {
    const newDocket = new Docket(command.name, command.display);
    const docket = await this.repository.create(newDocket);
    this.publisher.mergeObjectContext(newDocket).commit();
    return docket;
  }

  async updateDocket(command: SaveDocketCommand): Promise<any> {
    const raw = await this.repository.get(command._id);
    if (raw) {
      const docketToUpdate = plainToClass(Docket, raw);
      docketToUpdate.changeDetails(command.name, command.display);
      const docket = await this.repository.update(docketToUpdate);
      this.publisher.mergeObjectContext(docketToUpdate).commit();
      return docket;
    }
  }
}
