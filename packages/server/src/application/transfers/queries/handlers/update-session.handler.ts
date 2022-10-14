import { Inject, Logger} from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateSessionQuery } from '../update-session.query';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';

@QueryHandler(UpdateSessionQuery)
export class UpdateSessionHandler implements IQueryHandler<UpdateSessionQuery, any> {
  constructor(
    @Inject('IManifestRepository')
    private readonly manifestRepository: IManifestRepository,
  ) {}

  async execute(command: UpdateSessionQuery): Promise<any> {
    try {
      let result = await this.manifestRepository.updateSession();
      Logger.log('++++ SUCCESSFULLY UPDATED SESSIONS ++++');
      return result;
    } catch (e) {
      Logger.error(e);
      return;
    }
  }
}
