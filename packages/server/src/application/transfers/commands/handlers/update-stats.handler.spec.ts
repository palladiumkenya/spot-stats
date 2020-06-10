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

describe('Update Stats Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;

  let dockets: Docket[];
  let masterFacilities: MasterFacility[];
  let facilities: Facility[];
  let updateStatsCommands: UpdateStatsCommand[];

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
    updateStatsCommands = await getUpdateStatsCommands();
    await dbHelper.initConnection();
    await dbHelper.seedDb(
      'facilities',
      facilities.filter((x) => x.code === 12618),
    );
    const handler = module.get<UpdateStatsHandler>(UpdateStatsHandler);
    facilityRepository = module.get<IFacilityRepository>('IFacilityRepository');
    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(handler, UpdateStatsCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should Update Facility Stats', async () => {
    const existingFacility = facilities.find((x) => x.code === 12618);
    const updateStats = updateStatsCommands.filter(
      (x) => x.facilityCode === 12618,
    );
    for (const command of updateStats) {
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
