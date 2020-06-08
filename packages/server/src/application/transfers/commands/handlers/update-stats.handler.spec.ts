import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import {
  getDockets,
  getFacilities,
  getLogManifestCommands,
  getMasterFacs,
  getTestFacSummaries,
  getTestManifestMessages,
  getTestStatsData,
  getTestStatsMessage,
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
import uuid = require('uuid');
import { plainToClass } from 'class-transformer';
import { ClientProxyFactory } from '@nestjs/microservices';
import { LogManifestCommand } from '../log-manifest.command';
import { LogManifestHandler } from './log-manifest.handler';
import { InitializeSummariesHandler } from './initialize-summaries.handler';
import { InitializeSummariesCommand } from '../initialize-summaries-command';

describe('Update Stats Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;

  let dockets: Docket[];
  let masterFacilities: MasterFacility[];
  let facilities: Facility[];
  let logManifestCommands: LogManifestCommand[];

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
    logManifestCommands = await getLogManifestCommands();
    await dbHelper.initConnection();
    await dbHelper.seedDb('facilities', facilities);
    const logManifestHandler = module.get<LogManifestHandler>(
      LogManifestHandler,
    );
    const initializeSummariesHandler = module.get<InitializeSummariesHandler>(
      InitializeSummariesHandler,
    );
    const handler = module.get<UpdateStatsHandler>(UpdateStatsHandler);
    facilityRepository = module.get<IFacilityRepository>('IFacilityRepository');
    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(logManifestHandler, LogManifestCommand.name);
    commandBus.bind(
      initializeSummariesHandler,
      InitializeSummariesCommand.name,
    );
    commandBus.bind(handler, UpdateStatsCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should Update Facility Stats', async () => {
    const logManifestCommand = logManifestCommands[2];
    const resultA = await commandBus.execute(logManifestCommand);
    const existingFacility = facilities[1];
    const initializeSummariesCommand = new InitializeSummariesCommand(
      existingFacility._id,
      resultA._id,
    );

    const stats = [
      { name: 'HtsClientExtract', recieved: 25 },
      { name: 'HtsClientTestsExtract', recieved: 57 },
      { name: 'HtsClientLinkageExtract', recieved: 25 },
    ];

    const command = new UpdateStatsCommand(
      existingFacility.code,
      { name: 'HTS' },
      stats,
      new Date(),
    );
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const findresult = await facilityRepository.get(existingFacility._id);
    const facility = plainToClass(Facility, findresult);
    stats.forEach((stat) => {
      expect(
        facility.getStats(command.docket.name, stat.name).recieved,
      ).toEqual(stat.recieved);
    });

    facility.summaries.forEach((f) => {
      Logger.log(
        `${f.docket.name} - ${f.extract.name} ${f.expected} ${f.recieved}`,
      );
    });
  });
});
