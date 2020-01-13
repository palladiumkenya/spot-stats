import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import {
  getTestFacilities,
  getTestMeasures,
} from '../../../../../test/test.data';
import { GetMetricQuery } from '../get-metric.query';
import { GetMetricHandler } from './get-metric.handler';
import { IMetricRepository } from '../../../../domain/metrices/metric-repository.interface';
import { MetricsInfrastructureModule } from '../../../../infrastructure/metrices/metrics-infrastructure.module';
import { MetricesModule } from '../../metrices.module';

describe('Get Metrics', () => {
  let module: TestingModule;
  let repository: IMetricRepository;
  const dbHelper = new TestDbHelper();
  const { facilities } = getTestFacilities();
  const testFacilities = facilities;
  const { testMeasures, testMetrics } = getTestMeasures(testFacilities[0]._id);
  let queryBus: QueryBus;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        MetricesModule,
        MetricsInfrastructureModule,
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('facilities', facilities);
    await dbHelper.seedDb('measures', testMeasures);
    await dbHelper.seedDb('metrics', testMetrics);
    repository = module.get<IMetricRepository>('IMetricRepository');

    const handler = module.get<GetMetricHandler>(GetMetricHandler);

    queryBus = module.get<QueryBus>(QueryBus);
    queryBus.bind(handler, GetMetricQuery.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should get Fac Metrics', async () => {
    const query = new GetMetricQuery(testFacilities[0]._id);
    const result = await queryBus.execute<GetMetricQuery, any>(query);
    expect(result.length).toBeGreaterThan(0);
    result.forEach(d => Logger.debug(`${d.report}`));
  });
});
