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
  let testManifests;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TransfersInfrastructureModule,
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
      ],
    }).compile();
    manifests.forEach(m => {
      m.code = 100;
      m.isCurrent = false;
      m.logDate = new Date(2009, 1, 1);
    });
    manifests[3].isCurrent = true;
    manifests[3].logDate = new Date();
    testManifests = manifests;
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

  it('should check if manifests exisits', async () => {
    const result = await repository.manifestExists(testManifests[0].mId);
    expect(result).toBe(true);
  });

  it('should load Current', async () => {
    const data = await repository.getCurrent();
    expect(data.length).toBeGreaterThan(0);
    data.forEach(d => Logger.debug(`${d.name}`));
  });

  it('should load Current by Fac', async () => {
    const data = await repository.getCurrent(manifests[3].facility);
    expect(data).not.toBeUndefined();
  });

  it('should update Current', async () => {
    const data = await repository.updateCurrent(100);

    const saved = await repository.getAll({ isCurrent: true });

    expect(saved.length).toEqual(2);
  });
});
