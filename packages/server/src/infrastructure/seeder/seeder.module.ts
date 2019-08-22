import { Module } from '@nestjs/common';
import { SeedReader } from './seed-reader';
import { CourtsInfrastructureModule } from '../courts/courts-infrastructure.module';
import { MasterFacilitySeeder } from './master-facility.seeder';
import { DocketSeeder } from './docket.seeder';
import { RegistriesInfrastructureModule } from '../registries/registries-infrastructure.module';
import { TransfersInfrastructureModule } from '../transfers/transfers-infrastructure.module';

@Module({
  imports: [CourtsInfrastructureModule, RegistriesInfrastructureModule,
    TransfersInfrastructureModule],
  providers: [
    SeedReader, MasterFacilitySeeder, DocketSeeder,
  ],
})
export class SeederModule {

  constructor(
    private readonly docketSeeder: DocketSeeder,
    private readonly masterFacilitySeeder: MasterFacilitySeeder) {
  }

  async seedData() {
    await this.docketSeeder.seed();
    await this.masterFacilitySeeder.seed();
  }
}
