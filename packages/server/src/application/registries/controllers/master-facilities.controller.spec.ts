import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../test/test-db.helper';
import { getTestMasterFacilities } from '../../../../test/test.data';
import { MasterFacility } from '../../../domain/registries/master-facility';
import { MasterFacilitiesController } from './master-facilities.controller';
import { RegistriesModule } from '../registries.module';
import { SaveMasterFacilityHandler } from '../commands/handlers/save-master-facility.handler';
import { GetMasterFacilitiesHandler } from '../queries/handlers/get-master-facilities.handler';
import { SaveMasterFacilityCommand } from '../commands/save-master-facility.command';
import { GetMasterFacilitiesQuery } from '../queries/get-master-facilities.query';
import * as uuid from 'uuid';

describe('Practices Controller Tests', () => {
  let module: TestingModule;
  let testMasterFacilities: MasterFacility[] = [];
  const dbHelper = new TestDbHelper();
  let controller: MasterFacilitiesController;
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

    const saveMasterFacilityHandler = module.get<SaveMasterFacilityHandler>(
      SaveMasterFacilityHandler,
    );
    const commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(saveMasterFacilityHandler, SaveMasterFacilityCommand.name);

    const getMasterFacilitiesHandler = module.get<GetMasterFacilitiesHandler>(
      GetMasterFacilitiesHandler,
    );
    const queryBus = module.get<QueryBus>(QueryBus);
    queryBus.bind(getMasterFacilitiesHandler, GetMasterFacilitiesQuery.name);

    controller = new MasterFacilitiesController(commandBus, queryBus);
  });

  beforeEach(async () => {
    liveMasterFacility = new MasterFacility(uuid.v1(), 111, 'XXX');
    await dbHelper.seedDb('masterfacilities', [liveMasterFacility]);
  });

  it('should create MasterFacility', async () => {
    const command = { code: 233, name: 'Demo' };
    const result = await controller.createOrUpdateMasterFacility(command);
    expect(result).not.toBeNull();
    Logger.debug(result);
  });

  it('should get All MasterFacilities', async () => {
    const result = await controller.getMasterFacilities();
    expect(result.length).toBeGreaterThan(0);
    result.forEach(c => Logger.debug(`${c}`));
  });
});
