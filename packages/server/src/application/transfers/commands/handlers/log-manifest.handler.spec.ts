import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Controller, Injectable, Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import {
  getManifests,
  getTestFacilities,
  getTestManifestMessages,
  getTestStatsData,
} from '../../../../../test/test.data';
import * as uuid from 'uuid';
import { IFacilityRepository } from '../../../../domain';
import { LogManifestCommand } from '../log-manifest.command';
import { LogManifestHandler } from './log-manifest.handler';
import { TransfersModule } from '../../transfers.module';
import { CourtsInfrastructureModule } from '../../../../infrastructure/courts';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';
import { ClientProxyFactory, EventPattern } from '@nestjs/microservices';
import { DocketsController } from '../../../courts/controllers';
import {
  DeleteDocketHandler,
  SaveDocketHandler,
} from '../../../courts/commands';
import { GetDocketsHandler } from '../../../courts/queries';
import {
  DocketCreatedEventHandler,
  DocketDeletedEventHandler,
  DocketUpdatedEventHandler,
} from '../../../courts/events';
import { queue } from 'rxjs/internal/scheduler/queue';

describe('Log Manifest Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  const {
    dockets,
    masterFacilities,
    facilities,
    manifests,
  } = getTestFacilities();
  const dbHelper = new TestDbHelper();
  const liveData = facilities[0];
  let facilityRepository: IFacilityRepository;
  let manifestRepository: IManifestRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CqrsModule,
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        TransfersModule,
        CourtsInfrastructureModule,
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', dockets);
    await dbHelper.seedDb('masterfacilities', masterFacilities);
    const manifestsTosave = manifests.filter(
      x => x.facility === facilities[0]._id,
    );
    manifestsTosave.forEach(m => {
      m.name = liveData.name = masterFacilities[0].name;
      m.code = liveData.code = masterFacilities[0].code;
    });

    await dbHelper.seedDb('facilities', [liveData]);
    await dbHelper.seedDb('manifests', manifestsTosave);
    const handler = module.get<LogManifestHandler>(LogManifestHandler);
    facilityRepository = module.get<IFacilityRepository>('IFacilityRepository');
    manifestRepository = module.get<IManifestRepository>('IManifestRepository');
    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(handler, LogManifestCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should log Manifest-New Facility', async () => {
    const newFacility = facilities[1];
    newFacility.name = masterFacilities[1].name;
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
      true,
    );
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const facility = await facilityRepository.findByCode(newFacility.code);
    expect(facility).not.toBeNull();
    expect(facility.manifests.length).toBe(1);
    expect(facility.masterFacility).not.toBeNull();

    Logger.log(result);
    Logger.log(facility.masterFacility);
  });

  it('should log Manifest-Existing Facility', async () => {
    const existingFacility = liveData;
    const command = new LogManifestCommand(
      uuid.v1(),
      existingFacility.code,
      existingFacility.name,
      dockets[0].name,
      new Date(),
      new Date(),
      100,
      '',
      true,
    );
    const resultA = await commandBus.execute(command);
    expect(resultA).not.toBeNull();

    const facility = await facilityRepository.findByCode(existingFacility.code);
    expect(facility).not.toBeNull();
    expect(facility.manifests.length).toBeGreaterThan(1);
    Logger.log(facility);
  });
});
