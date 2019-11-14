import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbHelper } from '../../../test/test-db.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricsInfrastructureModule } from './metrics-infrastructure.module';
import { IMetricRepository } from '../../domain/metrices/metric-repository.interface';
import { getTestFacilities, getTestMeasures } from '../../../test/test.data';

describe('Metric Repository Tests', () => {
  let module: TestingModule;
  let repository: IMetricRepository;
  const dbHelper = new TestDbHelper();
  const { facilities } = getTestFacilities();
  const testFacilities = facilities;
  const { testMeasures, testMetrics } = getTestMeasures(testFacilities[0]._id);

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MetricsInfrastructureModule,
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('facilities', facilities);
    await dbHelper.seedDb('measures', testMetrics);
    repository = module.get<IMetricRepository>('IMetricRepository');
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should be defined', async () => {
    expect(repository).toBeDefined();
  });

  it('should load Metrics', async () => {
    const data = await repository.getAll();
    expect(data.length).toBeGreaterThan(0);
    data.forEach(d => Logger.debug(`${d.name}`));
  });
});
