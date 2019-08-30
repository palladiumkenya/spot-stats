import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import {
  getTestFacilities,
  getTestStatsData,
} from '../../../../../test/test.data';
import { IFacilityRepository } from '../../../../domain';
import { TransfersModule } from '../../transfers.module';
import { CourtsInfrastructureModule } from '../../../../infrastructure/courts';
import { InitializeSummariesCommand } from '../initialize-summaries-command';
import { InitializeSummariesHandler } from './initialize-summaries.handler';

describe('Initialize Facility Summary Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  const { dockets, masterfacilities } = getTestStatsData();
  const { facilities, manifests } = getTestFacilities();
  const dbHelper = new TestDbHelper();
  const liveData = facilities[0];
  liveData.summaries = [];
  let facilityRepository: IFacilityRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        TransfersModule,
        CourtsInfrastructureModule,
      ],
    }).compile();

    liveData.code = masterfacilities[0].code;
    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', dockets);
    await dbHelper.seedDb('masterfacilities', masterfacilities);
    await dbHelper.seedDb('facilities', [liveData]);
    await dbHelper.seedDb('manifests', manifests);

    const handler = module.get<InitializeSummariesHandler>(
      InitializeSummariesHandler,
    );
    facilityRepository = module.get<IFacilityRepository>('IFacilityRepository');
    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(handler, InitializeSummariesCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should Initialize Facility Summary', async () => {
    const existingFacility = facilities[0];
    existingFacility.code = masterfacilities[0].code;
    const command = new InitializeSummariesCommand(
      existingFacility._id,
      manifests[0]._id,
    );
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const facility = await facilityRepository.get(existingFacility._id);
    expect(facility).not.toBeNull();
    expect(facility.summaries.length).toBeGreaterThan(0);
    Logger.log(facility.summaries);
  });

  it('should Reset Facility Summary', async () => {
    const existingFacility = facilities[0];
    existingFacility.code = masterfacilities[0].code;
    const command = new InitializeSummariesCommand(
      existingFacility._id,
      manifests[0]._id,
    );
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const facility = await facilityRepository.get(existingFacility._id);
    expect(facility).not.toBeNull();
    expect(facility.summaries.length).toBeGreaterThan(0);
    Logger.log(facility.summaries);
  });
});
