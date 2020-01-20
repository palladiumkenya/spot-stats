import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { getTestMasterFacilities } from '../../../../../test/test.data';
import { RegistriesModule } from '../../registries.module';
import { MasterFacility } from '../../../../domain/registries/master-facility';
import { IMasterFacilityRepository } from '../../../../domain';
import { UpdateMechanismHandler } from './update-mechanism.handler';
import * as uuid from 'uuid';
import { UpdateMechanismCommand } from '../update-mechanism.command';

describe('Update Mechanism Command Tests', () => {
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

    const updateMechanismHandler = module.get<UpdateMechanismHandler>(
      UpdateMechanismHandler,
    );

    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(updateMechanismHandler, UpdateMechanismCommand.name);
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
    liveMasterFacility.mechanism = JSON.parse(
      '{\n' +
        '  "_id": "9eb172ca-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
        '  "code": 18495,\n' +
        '  "name": "AfyaNyotayaBonde",\n' +
        '  "implementationName": "AfyaNyotayaBonde",\n' +
        '  "mechanism": {\n' +
        '    "_id": "9eb170ca-bb7b-11e9-9cb5-2a2ae2dbcce4"\n' +
        '  }\n' +
        '}',
    );
    await dbHelper.seedDb('masterfacilities', [liveMasterFacility]);
  });

  it('should modify Master Facility Mechanism', async () => {
    const mechanism = {
      _id: '9eb172ca-bb7b-11e9-9cb5-2a2ae2dbcce4',
      code: 13588,
      name: 'Afya Ziwani',
      implementationName: 'Afya Ziwani',
      mechanism: {
        _id: '9eb170ca-bb7b-11e9-9cb5-2a2ae2dbcce4',
        name: 'AHF',
        display: 'AHF',
      },
    };
    const command = new UpdateMechanismCommand([mechanism]);
    const result = await commandBus.execute(command);
    expect(result).toBeGreaterThan(0);
    const fac = await repository.findByCode(1111);

    expect(fac).not.toBeUndefined();
    expect(fac.mechanism.name).toBe('Afya Ziwani');
    Logger.debug(fac.mechanism.name);
  });
});
