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

describe('Log Manifest Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  const { dockets, masterFacilities, facilities } = getTestFacilities();
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
    await dbHelper.seedDb('masterfacilities', masterFacilities);
    liveData.code = masterFacilities[0].code;
    await dbHelper.seedDb('facilities', [liveData]);

    const handler = module.get<LogManifestHandler>(LogManifestHandler);
    facilityRepository = module.get<IFacilityRepository>('IFacilityRepository');
    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(handler, LogManifestCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should log Manifest-New', async () => {
    const newFacility = facilities[1];
    newFacility.code = masterFacilities[1].code;
    const command = new LogManifestCommand(
      uuid.v1(),
      newFacility.code,
      newFacility.name,
      dockets[0].name,
      new Date(),
      new Date(),
      100,
      '',
    );
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const facility = await facilityRepository.findByCode(newFacility.code);
    expect(facility).not.toBeNull();
    expect(facility.manifests.length).toBeGreaterThan(0);
    Logger.log(facility);
  });

  it('should log Manifest-Existing', async () => {
    const existingFacility = facilities[0];
    existingFacility.code = masterFacilities[0].code;
    const command = new LogManifestCommand(
      uuid.v1(),
      existingFacility.code,
      existingFacility.name,
      dockets[0].name,
      new Date(),
      new Date(),
      100,
      '',
    );
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const facility = await facilityRepository.findByCode(existingFacility.code);
    expect(facility).not.toBeNull();
    expect(facility.manifests.length).toBeGreaterThan(1);
    Logger.log(facility);
  });
});
