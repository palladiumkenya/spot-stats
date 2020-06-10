import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
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
import { LogManifestCommand } from '../log-manifest.command';
import { LogManifestHandler } from './log-manifest.handler';
import { TransfersModule } from '../../transfers.module';
import { CourtsInfrastructureModule } from '../../../../infrastructure/courts';
import { IManifestRepository } from '../../../../domain/transfers/manifest-repository.interface';

describe('Log Manifest Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;

  let dockets: Docket[];
  let masterFacilities: MasterFacility[];
  let facilities: Facility[];
  let logManifestCommands: LogManifestCommand[];

  const dbHelper = new TestDbHelper();
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

    dockets = await getDockets();
    masterFacilities = await getMasterFacs();
    facilities = await getFacilities();
    logManifestCommands = await getLogManifestCommands();

    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', dockets);
    await dbHelper.seedDb('masterfacilities', masterFacilities);
    await dbHelper.seedDb(
      'facilities',
      facilities.filter((x) => x.code === 14950),
    );
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
    const commands = logManifestCommands.filter(
      (l) => l.facilityCode === 12618,
    );

    for (const command of commands) {
      const result = await commandBus.execute(command);
      expect(result).not.toBeNull();
    }

    const facility = await facilityRepository.findByCode(
      commands[0].facilityCode,
    );
    expect(facility).not.toBeNull();
    expect(facility.manifests.length).toBe(dockets.length);
    expect(facility.masterFacility).not.toBeNull();
  });

  it('should log Manifest-Existing Facility', async () => {
    const existingFacility = facilities.find((x) => x.code === 14950);
    const command = logManifestCommands.filter(
      (x) => x.facilityCode === 14950,
    )[0];
    const resultA = await commandBus.execute(command);
    expect(resultA).not.toBeNull();

    const facility = await facilityRepository.findByCode(existingFacility.code);
    expect(facility).not.toBeNull();
    expect(facility.manifests.length).toBeGreaterThan(0);
  });
});
