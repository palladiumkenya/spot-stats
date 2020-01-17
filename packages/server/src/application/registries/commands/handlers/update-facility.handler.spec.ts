import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { getTestMasterFacilities } from '../../../../../test/test.data';
import { RegistriesModule } from '../../registries.module';
import { MasterFacility } from '../../../../domain/registries/master-facility';
import { IMasterFacilityRepository } from '../../../../domain';
import { UpdateFacilityHandler } from './update-facility.handler';
import * as uuid from 'uuid';
import { UpdateFacilityCommand } from '../update-facility.command';

describe('Update Facility Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  let testMasterFacilities: MasterFacility[] = [];
  const dbHelper = new TestDbHelper();
  let liveMasterFacility: MasterFacility;
  let repository: IMasterFacilityRepository;

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

    const updateFacilityHandler = module.get<UpdateFacilityHandler>(
      UpdateFacilityHandler,
    );

    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(updateFacilityHandler, UpdateFacilityCommand.name);
    repository = module.get<IMasterFacilityRepository>(
      'IMasterFacilityRepository',
    );
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  beforeEach(async () => {
    liveMasterFacility = new MasterFacility(uuid.v1(), 1111, 'XXX-ZZX');
    await dbHelper.seedDb('masterfacilities', [liveMasterFacility]);
  });

  it('should modify Master Facility Details', async () => {
    const facility = {
      _id: liveMasterFacility._id,
      code: 1111,
      name: 'Kitengela Health Centre',
      county: {
        _id: '9eb175a4-bb7b-11e9-9cb5-2a2ae2dbcce4',
        code: 34,
        name: 'KAJIADO',
      },
    };
    const command = new UpdateFacilityCommand([facility]);
    const result = await commandBus.execute(command);
    expect(result).toBeGreaterThan(0);
    const fac = await repository.findByCode(1111);

    expect(fac).not.toBeUndefined();
    expect(fac.name).toBe('Kitengela Health Centre');
    Logger.debug(fac.name);
  });
});
