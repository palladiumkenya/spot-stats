import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import {
  getTestFacilities,
  getTestStatsData,
} from '../../../../../test/test.data';
import * as uuid from 'uuid';
import { IFacilityRepository } from '../../../../domain';
import { TransfersModule } from '../../transfers.module';
import { CourtsInfrastructureModule } from '../../../../infrastructure/courts';
import { InitializeSummariesCommand } from '../initialize-summaries-command';
import { InitializeSummariesHandler } from './initialize-summaries.handler';
import { UpdateStatsCommand } from '../update-stats.command';
import { UpdateStatsHandler } from './update-stats.handler';

describe('Update Stats Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  const { dockets, masterfacilities } = getTestStatsData();
  const { facilities } = getTestFacilities();
  const dbHelper = new TestDbHelper();
  const liveData = facilities[0];
  let facilityRepository: IFacilityRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        TransfersModule,
        CourtsInfrastructureModule,
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', dockets);
    await dbHelper.seedDb('masterfacilities', masterfacilities);
    liveData.code = masterfacilities[0].code;
    await dbHelper.seedDb('facilities', [liveData]);

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
    const existingFacility = facilities[0];
    existingFacility.code = masterfacilities[0].code;
    const command = new UpdateStatsCommand(
      existingFacility.code,
      { name: 'HTS' },
      [{ name: 'Clients', recieved: 100 }, { name: 'HtsTests', recieved: 150 }],
      new Date(),
    );
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const facility = await facilityRepository.get(existingFacility._id);
    expect(facility).not.toBeNull();
    expect(facility.summaries.length).toBeGreaterThan(0);
    Logger.log(facility.summaries);
  });
});
