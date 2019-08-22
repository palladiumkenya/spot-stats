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
import { LogManifestCommand } from '../log-manifest.command';
import { LogManifestHandler } from './log-manifest.handler';
import { TransfersModule } from '../../transfers.module';
import { CourtsInfrastructureModule } from '../../../../infrastructure/courts';
import { AssignMasterFacilityCommand } from '../assign-master-facility.command';
import { AssignMasterFacilityHandler } from './assign-master-facility.handler';
import { InitializeSummariesCommand } from '../initialize-summaries-command';
import { InitializeSummariesHandler } from './initialize-summaries.handler';

describe('Initialize Facility Summary Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  const { dockets, masterfacilities } = getTestStatsData();
  const { facilities } = getTestFacilities();
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

    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', dockets);
    await dbHelper.seedDb('masterfacilities', masterfacilities);
    liveData.code = masterfacilities[0].code;
    await dbHelper.seedDb('facilities', [liveData]);

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
      existingFacility.manifests[0].mId,
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
      existingFacility.manifests[0].mId,
    );
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const facility = await facilityRepository.get(existingFacility._id);
    expect(facility).not.toBeNull();
    expect(facility.summaries.length).toBeGreaterThan(0);
    Logger.log(facility.summaries);
  });
});
