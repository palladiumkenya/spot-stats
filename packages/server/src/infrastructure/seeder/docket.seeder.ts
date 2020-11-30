import { Inject, Injectable, Logger } from '@nestjs/common';
import { SeedReader } from './seed-reader';
import { deserializeArray } from 'class-transformer';
import { IDocketRepository } from '../../domain/courts/docket-repository.interface';
import { Docket } from '../../domain/courts/docket';
@Injectable()
export class DocketSeeder {
  constructor(
    private readonly reader: SeedReader,
    @Inject('IDocketRepository')
    private readonly repository: IDocketRepository,
  ) {}

  async load(): Promise<Docket[]> {
    const seedData = await this.reader.read(Docket.name.toLowerCase());
    const dockets = deserializeArray(Docket, seedData);
    return dockets;
  }

  async seed(): Promise<number> {
    const seedData = await this.load();
    const count = await this.repository.getCount();
    if (count === 0) {
      Logger.log(`Seeding ${Docket.name}(s)...`);
      await this.repository.createBatch(seedData);
      return seedData.length;
    }
    return 0;
  }
}
