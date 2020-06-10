import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus } from '@nestjs/cqrs';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import {
  getDockets,
  getFacilities,
  getLogManifestCommands,
  getMasterFacs,
} from '../../../../../test/test.data';
import {
  Docket,
  Facility,
  IFacilityRepository,
  MasterFacility,
} from '../../../../domain';
import { TransfersModule } from '../../transfers.module';
import { CourtsInfrastructureModule } from '../../../../infrastructure/courts';
import { InitializeSummariesCommand } from '../initialize-summaries-command';
import { InitializeSummariesHandler } from './initialize-summaries.handler';
import { LogManifestCommand } from '../log-manifest.command';
import { LogManifestHandler } from './log-manifest.handler';
import uuid = require('uuid');

describe('Initialize Facility Summary Command Tests', () => {
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
    await dbHelper.seedDb('dockets', dockets);
    await dbHelper.seedDb('masterfacilities', masterFacilities);
    await dbHelper.seedDb('facilities', facilities);
    const logManifestHandler = module.get<LogManifestHandler>(
      LogManifestHandler,
    );
    const handler = module.get<InitializeSummariesHandler>(
      InitializeSummariesHandler,
    );
    facilityRepository = module.get<IFacilityRepository>('IFacilityRepository');
    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(logManifestHandler, LogManifestCommand.name);
    commandBus.bind(handler, InitializeSummariesCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should Initialize Facility Summary', async () => {
    const existingFacility = facilities.find((x) => x.code === 14950);
    for (const logManifestCommand of logManifestCommands.filter(
      (x) => x.facilityCode === 14950,
    )) {
      const resultA = await commandBus.execute(logManifestCommand);
      const command = new InitializeSummariesCommand(
        existingFacility._id,
        resultA._id,
      );
      const result = await commandBus.execute(command);
      expect(result).not.toBeNull();
      const facility = await facilityRepository.get(existingFacility._id);
      expect(facility).not.toBeNull();
      expect(facility.summaries.length).toBeGreaterThan(0);
      expect(
        facility.summaries.find(
          (s) =>
            s.extract.isPatient && s.docket.name === logManifestCommand.docket,
        ).expected,
      ).toBeGreaterThan(0);
    }
  });

  it('should Reset Facility Summary', async () => {
    const existingFacility = facilities.find((x) => x.code === 12618);
    for (const logManifestCommand of logManifestCommands.filter(
      (x) => x.facilityCode === 12618,
    )) {
      // logManifestCommand.id = uuid.v1();
      const resultA = await commandBus.execute(logManifestCommand);
      const command = new InitializeSummariesCommand(
        existingFacility._id,
        resultA._id,
      );
      const result = await commandBus.execute(command);
      expect(result).not.toBeNull();
      const facility = await facilityRepository.get(existingFacility._id);
      expect(facility).not.toBeNull();
      expect(facility.summaries.length).toBeGreaterThan(0);
      expect(
        facility.summaries.find(
          (s) =>
            s.extract.isPatient && s.docket.name === logManifestCommand.docket,
        ).recieved,
      ).toBe(0);
    }
  });
});
