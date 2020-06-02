import { Module } from '@nestjs/common';
import { SeedReader } from './seed-reader';
import { CourtsInfrastructureModule } from '../courts/courts-infrastructure.module';
import { MasterFacilitySeeder } from './master-facility.seeder';
import { DocketSeeder } from './docket.seeder';
import { RegistriesInfrastructureModule } from '../registries/registries-infrastructure.module';
import { TransfersInfrastructureModule } from '../transfers/transfers-infrastructure.module';
import { MeasureSeeder } from './measure.seeder';
import { MetricsInfrastructureModule } from '../metrices/metrics-infrastructure.module';
import { NoticeBoardSeeder } from './notice-board.seeder';
import { NotificationsInfrastructureModule } from '../notifications';

@Module({
  imports: [
    CourtsInfrastructureModule,
    RegistriesInfrastructureModule,
    TransfersInfrastructureModule,
    MetricsInfrastructureModule,
    NotificationsInfrastructureModule,
  ],
  providers: [
    SeedReader,
    MasterFacilitySeeder,
    DocketSeeder,
    MeasureSeeder,
    NoticeBoardSeeder,
  ],
})
export class SeederModule {
  constructor(
    private readonly docketSeeder: DocketSeeder,
    private readonly masterFacilitySeeder: MasterFacilitySeeder,
    private readonly measureSeeder: MeasureSeeder,
    private readonly noticeBoardSeeder: NoticeBoardSeeder,
  ) {}

  async seedData() {
    await this.docketSeeder.seed();
    await this.masterFacilitySeeder.seed();
    await this.measureSeeder.seed();
    await this.noticeBoardSeeder.seed();
  }
}
