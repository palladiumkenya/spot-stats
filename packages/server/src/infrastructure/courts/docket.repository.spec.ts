import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbHelper } from '../../../test/test-db.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { DocketRepository } from './docket.repository';
import { getTestDockets } from '../../../test/test.data';
import { IDocketRepository } from '../../domain/courts/docket-repository.interface';
import { CourtsInfrastructureModule } from './courts-infrastructure.module';

describe('Docket Repository  Tests', () => {
  let module: TestingModule;
  let repository: IDocketRepository;
  const dbHelper = new TestDbHelper();
  const testDockets = getTestDockets();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        CourtsInfrastructureModule,
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', testDockets);
    repository = module.get<IDocketRepository>('IDocketRepository');
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should be defined', async () => {
    expect(repository).toBeDefined();
  });

  it('should find Dockets By Name', async () => {
    const docket = await repository.findByName(testDockets[0].name);
    expect(docket).not.toBeNull();
    const { extracts } = docket;
    expect(extracts.length).toBeGreaterThan(0);

    Logger.debug(`${docket.display}`);
    docket.extracts.map(e => Logger.debug(` >> ${e.display} `));
  });
});
