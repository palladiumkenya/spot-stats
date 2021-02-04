import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus } from '@nestjs/cqrs';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { MasterFacility } from '../../../../domain/registries/master-facility';
import { RegistriesModule } from '../../registries.module';
import { DeleteMasterFacilityHandler } from './delete-master-facility.handler';
import { getTestMasterFacilities } from '../../../../../test/test.data';
import { DeleteMasterFacilityCommand } from '../delete-master-facility.command';
import * as uuid from 'uuid';

describe('Delete MasterFacility Command Tests', () => {
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

    const deleteHandler = module.get<DeleteMasterFacilityHandler>(
      DeleteMasterFacilityHandler,
    );

    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(deleteHandler, DeleteMasterFacilityCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  beforeEach(async () => {
    liveMasterFacility = new MasterFacility(uuid.v1(), 333, 'XXX-ZZX');
    await dbHelper.seedDb('masterfacilities', [liveMasterFacility]);
  });

  it('should delete MasterFacility', async () => {
    const command = new DeleteMasterFacilityCommand(liveMasterFacility._id);
    const result = await commandBus.execute(command);
    expect(result).toBe(true);
  });
});
