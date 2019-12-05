import { Inject, Injectable, Logger } from '@nestjs/common';
import { SeedReader } from './seed-reader';
import { deserializeArray } from 'class-transformer';
import { IMeasureRepository } from '../../domain/metrices/measure-repository.interface';
import { Measure } from '../../domain/metrices/measure';

@Injectable()
export class MeasureSeeder {
  constructor(
    private readonly reader: SeedReader,
    @Inject('IMeasureRepository')
    private readonly repository: IMeasureRepository,
  ) {}

  async load(): Promise<Measure[]> {
    const seedData = await this.reader.read(Measure.name.toLowerCase());
    const measures = deserializeArray(Measure, seedData);
    return measures;
  }

  async seed(): Promise<number> {
    const seedData = await this.load();
    const count = await this.repository.getCount();
    if (count === 0) {
      Logger.log(`Seeding ${Measure.name}(s)...`);
      await this.repository.createBatch(seedData);
      return seedData.length;
    }
    return 0;
  }
}
