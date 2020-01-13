import { Module } from '@nestjs/common';
import { SeedReader } from './seed-reader';
import { CourtsInfrastructureModule } from '../courts/courts-infrastructure.module';
import { MasterFacilitySeeder } from './master-facility.seeder';
import { DocketSeeder } from './docket.seeder';
import { RegistriesInfrastructureModule } from '../registries/registries-infrastructure.module';
import { TransfersInfrastructureModule } from '../transfers/transfers-infrastructure.module';
import { MeasureSeeder } from './measure.seeder';
import { MetricsInfrastructureModule } from '../metrices/metrics-infrastructure.module';

@Module({
  imports: [
    CourtsInfrastructureModule,
    RegistriesInfrastructureModule,
    TransfersInfrastructureModule,
    MetricsInfrastructureModule,
  ],
  providers: [SeedReader, MasterFacilitySeeder, DocketSeeder, MeasureSeeder],
})
export class SeederModule {
  constructor(
    private readonly docketSeeder: DocketSeeder,
    private readonly masterFacilitySeeder: MasterFacilitySeeder,
    private readonly measureSeeder: MeasureSeeder,
  ) {}

  async seedData() {
    await this.docketSeeder.seed();
    await this.masterFacilitySeeder.seed();
    await this.measureSeeder.seed();
  }
}
