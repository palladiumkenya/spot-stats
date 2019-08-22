import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { GetDocketsHandler } from './get-dockets.handler';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { getTestDockets } from '../../../../../test/test.data';
import { QueryBus } from '@nestjs/cqrs';
import { Docket } from '../../../../domain/courts/docket';
import { CourtsModule } from '../../courts.module';
import { DocketDto } from '../../../../domain/courts/dtos/docket.dto';
import { GetDocketsQuery } from '../get-dockets.query';

describe('Get Docket Query Tests', () => {
  let module: TestingModule;
  let queryBus: QueryBus;
  let testDockets: Docket[] = [];
  const dbHelper = new TestDbHelper();
  let liveDocket: Docket;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        CourtsModule,
      ],
    }).compile();

    testDockets = getTestDockets(5);
    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', testDockets);

    const getDocketsHandler = module.get<GetDocketsHandler>(GetDocketsHandler);

    queryBus = module.get<QueryBus>(QueryBus);
    queryBus.bind(getDocketsHandler, GetDocketsQuery.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  beforeEach(async () => {
    liveDocket = new Docket('XXX', 'XXX-ZZX');
    await dbHelper.seedDb('dockets', [liveDocket]);
  });

  it('should get new Docket', async () => {
    const query = new GetDocketsQuery();
    const result = await queryBus.execute<GetDocketsQuery, DocketDto[]>(query);
    expect(result.length).toBeGreaterThan(0);
    result.forEach(c => Logger.debug(`${c}`));
  });
});
