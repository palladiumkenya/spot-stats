import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { getTestMasterFacilities } from '../../../../../test/test.data';
import { QueryBus } from '@nestjs/cqrs';
import { MasterFacility } from '../../../../domain/registries/master-facility';
import { RegistriesModule } from '../../registries.module';
import { GetMasterFacilitiesHandler } from './get-master-facilities.handler';
import { GetMasterFacilitiesQuery } from '../get-master-facilities.query';
import * as uuid from 'uuid';
import { MasterFacilityDto } from '../../../../domain/registries/dtos/master-facility.dto';

describe('Get MasterFacility Query Tests', () => {
  let module: TestingModule;
  let queryBus: QueryBus;
  let testMasterFacilities: MasterFacility[] = [];
  const dbHelper = new TestDbHelper();
  let liveMasterFacility: MasterFacility;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        RegistriesModule,
      ],
    }).compile();

    testMasterFacilities = getTestMasterFacilities(5);
    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', testMasterFacilities);

    const getMasterFacilitiesHandler = module.get<GetMasterFacilitiesHandler>(GetMasterFacilitiesHandler);

    queryBus = module.get<QueryBus>(QueryBus);
    queryBus.bind(getMasterFacilitiesHandler, GetMasterFacilitiesQuery.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  beforeEach(async () => {
    liveMasterFacility = new MasterFacility(uuid.v1(), 234, 'XXX-ZZX');
    await dbHelper.seedDb('masterfacilities', [liveMasterFacility]);
  });

  it('should get new MasterFacility', async () => {
    const query = new GetMasterFacilitiesQuery();
    const result = await queryBus.execute<GetMasterFacilitiesQuery, MasterFacilityDto[]>(query);
    expect(result.length).toBeGreaterThan(0);
    result.forEach(c => Logger.debug(`${c}`));
  });
});
