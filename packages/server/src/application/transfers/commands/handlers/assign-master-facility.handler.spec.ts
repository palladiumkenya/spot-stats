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

describe('Log Assign Master Facility Command Tests', () => {
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

    const handler = module.get<AssignMasterFacilityHandler>(
      AssignMasterFacilityHandler,
    );
    facilityRepository = module.get<IFacilityRepository>('IFacilityRepository');
    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(handler, AssignMasterFacilityCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should Assign Master Facility', async () => {
    const existingFacility = facilities[0];
    existingFacility.code = masterfacilities[0].code;
    const command = new AssignMasterFacilityCommand(existingFacility._id);
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const facility = await facilityRepository.get(existingFacility._id);
    expect(facility).not.toBeNull();
    expect(facility.masterFacility).not.toBeNull();
    Logger.log(facility.masterFacility);
  });
});
