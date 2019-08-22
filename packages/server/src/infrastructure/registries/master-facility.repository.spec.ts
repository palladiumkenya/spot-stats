import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbHelper } from '../../../test/test-db.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { IMasterFacilityRepository } from '../../domain/registries/master-facility-repository.interface';
import { getTestMasterFacilities } from '../../../test/test.data';
import { MasterFacilityRepository } from './master-facility.repository';
import { RegistriesInfrastructureModule } from './registries-infrastructure.module';

describe('Master Facility Repository  Tests', () => {
  let module: TestingModule;
  let repository: IMasterFacilityRepository;
  const dbHelper = new TestDbHelper();
  const testMasterFacilities = getTestMasterFacilities();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        RegistriesInfrastructureModule,
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('masterfacilities', testMasterFacilities);
    repository = module.get<IMasterFacilityRepository>('IMasterFacilityRepository');
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
});
