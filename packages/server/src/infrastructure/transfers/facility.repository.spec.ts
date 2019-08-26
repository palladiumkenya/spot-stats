import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbHelper } from '../../../test/test-db.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { getTestFacilities } from '../../../test/test.data';
import { TransfersInfrastructureModule } from './transfers-infrastructure.module';
import { IFacilityRepository } from '../../domain/transfers/facility-repository.interface';

describe('Facility Repository  Tests', () => {
  let module: TestingModule;
  let repository: IFacilityRepository;
  const dbHelper = new TestDbHelper();
  const { facilities } = getTestFacilities();
  const testFacilities = facilities;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TransfersInfrastructureModule,
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('facilities', testFacilities);
    repository = module.get<IFacilityRepository>('IFacilityRepository');
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should be defined', async () => {
    expect(repository).toBeDefined();
  });

  it('should load Facilities', async () => {
    const data = await repository.getAll();
    expect(data.length).toBeGreaterThan(0);
    data.forEach(d => Logger.debug(`${d.name}`));
  });

  it('should load By Facility Code', async () => {
    const facility = await repository.findByCode(testFacilities[0].code);
    expect(facility).not.toBeNull();
    Logger.log(facility);
  });

  it('should load Summary', async () => {
    const id = testFacilities[0]._id;
    const data = await repository.getSummary(id);
    expect(data).not.toBeNull();
    Logger.log(data);
  });
});
