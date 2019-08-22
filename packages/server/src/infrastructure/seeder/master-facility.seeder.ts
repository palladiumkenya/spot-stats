import { Inject, Injectable, Logger } from '@nestjs/common';
import { SeedReader } from './seed-reader';
import { deserializeArray } from 'class-transformer';
import { IMasterFacilityRepository } from '../../domain/registries/master-facility-repository.interface';
import { MasterFacility } from '../../domain/registries/master-facility';
@Injectable()
export class MasterFacilitySeeder {

  constructor(private readonly reader: SeedReader,
              @Inject('IMasterFacilityRepository')
              private readonly masterFacilityRepository: IMasterFacilityRepository) {
  }

  async load(): Promise<MasterFacility[]> {
    const seedData = await this.reader.read(MasterFacility.name.toLowerCase());
    const masterFacilities = deserializeArray(MasterFacility, seedData);
    return masterFacilities;
  }

  async seed(): Promise<number> {
    const seedData = await this.load();
    const count = await this.masterFacilityRepository.getCount();
    if (count === 0) {
      Logger.log(`Seeding ${MasterFacility.name}(s)...`);
      await this.masterFacilityRepository.createBatch(seedData);
      return seedData.length;
    }
    return 0;
  }
}
