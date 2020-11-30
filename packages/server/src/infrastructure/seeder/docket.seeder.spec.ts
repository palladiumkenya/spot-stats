import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbHelper } from '../../../test/test-db.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { SeederModule } from './seeder.module';
import { MasterFacilitySeeder } from './master-facility.seeder';
import { DocketSeeder } from './docket.seeder';

describe('Dockets Seeder Tests', () => {
  let module: TestingModule;
  let seeder: DocketSeeder;
  const dbHelper = new TestDbHelper();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        SeederModule,
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
      ],
    }).compile();

    await dbHelper.initConnection();
    seeder = module.get<DocketSeeder>(DocketSeeder);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should load Master Facility Seed', async () => {
    const seeds = await seeder.load();
    expect(seeds.length).toBeGreaterThan(-1);
    seeds.forEach((s) => Logger.debug(`${s.name} ${s} (${s._id})`));
  });
});
