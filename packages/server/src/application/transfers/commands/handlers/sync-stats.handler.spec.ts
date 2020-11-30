import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import {
  getDockets,
  getFacilities,
  getMasterFacs,
  getUpdateStatsCommands,
} from '../../../../../test/test.data';
import {
  Docket,
  Facility,
  IFacilityRepository,
  MasterFacility,
} from '../../../../domain';
import { TransfersModule } from '../../transfers.module';
import { CourtsInfrastructureModule } from '../../../../infrastructure/courts';
import { UpdateStatsCommand } from '../update-stats.command';
import { UpdateStatsHandler } from './update-stats.handler';
import { plainToClass } from 'class-transformer';
import { LogManifestCommand } from '../log-manifest.command';
import { SyncStatsCommand } from '../sync-stats.command';
import { SyncStatsHandler } from './sync-stats.handler';

describe('Sync Stats Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;

  let dockets: Docket[];
  let masterFacilities: MasterFacility[];
  let facilities: Facility[];
  let syncStatsCommands: SyncStatsCommand[];

  const dbHelper = new TestDbHelper();
  let facilityRepository: IFacilityRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        TransfersModule,
        CourtsInfrastructureModule,
      ],
    }).compile();
    dockets = await getDockets();
    masterFacilities = await getMasterFacs();
    facilities = await getFacilities();
    syncStatsCommands = await getUpdateStatsCommands();
    await dbHelper.initConnection();
    await dbHelper.seedDb(
      'facilities',
      facilities.filter((x) => x.code === 12618),
    );
    const handler = module.get<SyncStatsHandler>(SyncStatsHandler);
    facilityRepository = module.get<IFacilityRepository>('IFacilityRepository');
    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(handler, SyncStatsCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should Sync Facility Stats', async () => {
    const existingFacility = facilities.find((x) => x.code === 12618);
    const syncStats = syncStatsCommands.filter((x) => x.facilityCode === 12618);
    for (const command of syncStats) {
      const result = await commandBus.execute(command);
      expect(result).not.toBeNull();

      const findresult = await facilityRepository.get(existingFacility._id);
      const facility = plainToClass(Facility, findresult);
      command.stats.forEach((stat) => {
        expect(
          facility.getStats(command.docket.name, stat.name).recieved,
        ).toEqual(stat.recieved);
      });
    }
  });
});
