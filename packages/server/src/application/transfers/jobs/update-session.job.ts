import { Inject, Logger, Injectable } from '@nestjs/common';
import { IManifestRepository } from '../../../domain/transfers/manifest-repository.interface';

@Injectable()
export class UpdateSessionJob {
  constructor(
      @Inject('IManifestRepository')
      private readonly manifestRepository: IManifestRepository,
  ) {}

  async update(): Promise<any> {
    try {
      let result = await this.manifestRepository.updateSession()
      Logger.log('++++ SUCCESSFULLY UPDATED SESSION ++++');
      return result;
    } catch (e){
      Logger.error(e.message)
    }
  }
}
