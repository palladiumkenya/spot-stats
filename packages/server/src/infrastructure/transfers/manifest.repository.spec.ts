import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbHelper } from '../../../test/test-db.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { getTestFacilities } from '../../../test/test.data';
import { TransfersInfrastructureModule } from './transfers-infrastructure.module';
import { IManifestRepository } from '../../domain/transfers/manifest-repository.interface';

describe('Manifest Repository  Tests', () => {
  let module: TestingModule;
  let repository: IManifestRepository;
  const dbHelper = new TestDbHelper();
  const { facilities, manifests } = getTestFacilities();
  const testManifests = manifests;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TransfersInfrastructureModule,
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('facilities', facilities);
    await dbHelper.seedDb('manifests', testManifests);
    repository = module.get<IManifestRepository>('IManifestRepository');
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should be defined', async () => {
    expect(repository).toBeDefined();
  });

  it('should load Current', async () => {
    const data = await repository.getCurrent();
    expect(data.length).toBeGreaterThan(0);
    data.forEach(d => Logger.debug(`${d.name}`));
  });
});
