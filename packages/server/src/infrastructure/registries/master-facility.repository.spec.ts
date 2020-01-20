import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbHelper } from '../../../test/test-db.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { IMasterFacilityRepository } from '../../domain/registries/master-facility-repository.interface';
import { getTestMasterFacilities } from '../../../test/test.data';
import { MasterFacilityRepository } from './master-facility.repository';
import { RegistriesInfrastructureModule } from './registries-infrastructure.module';
import { UpdateAgencyCommand } from '../../application/registries/commands/update-agency.command';
import { MasterFacility } from '../../domain';
import * as uuid from 'uuid';

describe('Master Facility Repository  Tests', () => {
  let module: TestingModule;
  let repository: IMasterFacilityRepository;
  const dbHelper = new TestDbHelper();
  const testMasterFacilities = getTestMasterFacilities();
  let liveMasterFacility: MasterFacility;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        RegistriesInfrastructureModule,
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('masterfacilities', testMasterFacilities);
    repository = module.get<IMasterFacilityRepository>(
      'IMasterFacilityRepository',
    );
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

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should be defined', async () => {
    expect(repository).toBeDefined();
  });

  it('should load Master Facilities', async () => {
    const masterFacilities = await repository.getAll();
    expect(masterFacilities.length).toBeGreaterThan(0);
    masterFacilities.forEach(d => Logger.debug(`${d.name}`));
  });

  it('should modify Master Facility Agency', async () => {
    const agency = {
      _id: '9eb170ca-bb7b-11e9-9cb5-2a2ae2dbcce4',
      name: 'AHF',
      display: 'AHF',
    };
    const result = await repository.updateAgency([agency]);
    expect(result).toBeGreaterThan(0);
    const fac = await repository.findByCode(1111);

    expect(fac).not.toBeUndefined();
    expect(fac.mechanism.agency.name).toBe('AHF');
    Logger.debug(fac.mechanism.agency.name);
  });

  it('should modify Master Facility Mechanism', async () => {
    const mechanism = {
      _id: '9eb172ca-bb7b-11e9-9cb5-2a2ae2dbcce4',
      code: 13588,
      name: 'Afya Ziwani',
      implementationName: 'Afya Ziwani',
      agency: {
        _id: '9eb170ca-bb7b-11e9-9cb5-2a2ae2dbcce4',
        name: 'AHF',
        display: 'AHF',
      },
    };
    const result = await repository.updateMechanism([mechanism]);
    expect(result).toBeGreaterThan(0);
    const fac = await repository.findByCode(1111);

    expect(fac).not.toBeUndefined();
    expect(fac.mechanism.name).toBe('Afya Ziwani');
    Logger.debug(fac.mechanism.name);
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
    const result = await repository.updateFacility([facility]);
    expect(result).toBeGreaterThan(0);
    const fac = await repository.findByCode(1111);

    expect(fac).not.toBeUndefined();
    expect(fac.name).toBe('Kitengela Health Centre');
    Logger.debug(fac.name);
  });
});
