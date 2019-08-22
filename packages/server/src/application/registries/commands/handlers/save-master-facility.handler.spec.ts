import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { getTestMasterFacilities } from '../../../../../test/test.data';
import { Docket } from '../../../../domain/courts/docket';
import { RegistriesModule } from '../../registries.module';
import { MasterFacility } from '../../../../domain/registries/master-facility';
import { SaveMasterFacilityHandler } from './save-master-facility.handler';
import { SaveMasterFacilityCommand } from '../save-master-facility.command';
import * as uuid from 'uuid';

describe('Save Master Facility Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  let testMasterFacilities: MasterFacility[] = [];
  const dbHelper = new TestDbHelper();
  let liveMasterFacility: MasterFacility;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        RegistriesModule,
      ],
    }).compile();
    testMasterFacilities = getTestMasterFacilities(5);
    await dbHelper.initConnection();
    await dbHelper.seedDb('masterfacilities', testMasterFacilities);

    const saveDocketHandler = module.get<SaveMasterFacilityHandler>(
      SaveMasterFacilityHandler,
    );

    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(saveDocketHandler, SaveMasterFacilityCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  beforeEach(async () => {
    liveMasterFacility = new MasterFacility(uuid.v1(), 1111, 'XXX-ZZX');
    await dbHelper.seedDb('masterfacilities', [liveMasterFacility]);
  });

  it('should create Master Facility', async () => {
    const command = new SaveMasterFacilityCommand(3343, 'Demo');
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();
    Logger.debug(result);
  });

  it('should modify Master Facility', async () => {
    const command = new SaveMasterFacilityCommand(
      101,
      'NewTest',
      liveMasterFacility._id,
    );
    const result = await commandBus.execute(command);
    expect(result.code).toBe(101);
    expect(result.name).toBe('NewTest');
    expect(result._id).toBe(liveMasterFacility._id);
    Logger.debug(result);
  });
});
