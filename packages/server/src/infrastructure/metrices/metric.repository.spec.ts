import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbHelper } from '../../../test/test-db.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricsInfrastructureModule } from './metrics-infrastructure.module';
import { IMetricRepository } from '../../domain/metrices/metric-repository.interface';
import { getTestFacilities, getTestMeasures } from '../../../test/test.data';
import { TransfersInfrastructureModule } from '../transfers';

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
        TransfersInfrastructureModule,
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('facilities', facilities);
    await dbHelper.seedDb('measures', testMeasures);
    await dbHelper.seedDb('metrics', testMetrics);
    repository = module.get<IMetricRepository>('IMetricRepository');
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should be defined', async () => {
    expect(repository).toBeDefined();
  });

  it('should load By Metric Id', async () => {
    const data = await repository.findByMetricId(testMetrics[0].mId);
    expect(data).not.toBeUndefined();
    Logger.debug(`${data.measure}`);
  });

  it('should load Facility Metrics', async () => {
    const data = await repository.findByFacilityId(testFacilities[0]._id);
    expect(data.length).toBeGreaterThan(0);
    data.forEach(d => Logger.debug(`${d.report}`));
  });
});
