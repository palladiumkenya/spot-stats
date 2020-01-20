import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { getTestMasterFacilities } from '../../../../../test/test.data';
import { RegistriesModule } from '../../registries.module';
import { MasterFacility } from '../../../../domain/registries/master-facility';
import { UpdateAgencyCommand } from '../update-agency.command';
import { IMasterFacilityRepository } from '../../../../domain';
import { UpdateAgencyHandler } from './update-agency.handler';
import * as uuid from 'uuid';

describe('Update Agency Command Tests', () => {
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

    const updateAgencyHandler = module.get<UpdateAgencyHandler>(
      UpdateAgencyHandler,
    );

    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(updateAgencyHandler, UpdateAgencyCommand.name);
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
        '  "agency": {\n' +
        '    "_id": "9eb170ca-bb7b-11e9-9cb5-2a2ae2dbcce4"\n' +
        '  }\n' +
        '}',
    );
    await dbHelper.seedDb('masterfacilities', [liveMasterFacility]);
  });

  it('should modify Master Facility Agency', async () => {
    const agency = {
      _id: '9eb170ca-bb7b-11e9-9cb5-2a2ae2dbcce4',
      name: 'AHF',
      display: 'AHF',
    };
    const command = new UpdateAgencyCommand([agency]);
    const result = await commandBus.execute(command);
    expect(result).toBeGreaterThan(0);
    const fac = await repository.findByCode(1111);

    expect(fac).not.toBeUndefined();
    expect(fac.mechanism.agency.name).toBe('AHF');
    Logger.debug(fac.mechanism.agency.name);
  });

  it('should modify Master Facility Mechanisms', async () => {
    const agency = {
      _id: '9eb170ca-bb7b-11e9-9cb5-2a2ae2dbcce4',
      name: 'AHF',
      display: 'AHF',
    };
    const command = new UpdateAgencyCommand([agency]);
    const result = await commandBus.execute(command);
    expect(result).toBeGreaterThan(0);
    const fac = await repository.findByCode(1111);

    expect(fac).not.toBeUndefined();
    expect(fac.mechanism.agency.name).toBe('AHF');
    Logger.debug(fac.mechanism.agency.name);
  });
});
