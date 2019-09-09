import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import {
  getTestFacSummaries,
  getTestManifestMessages,
  getTestStatsData,
  getTestStatsMessage,
} from '../../../../../test/test.data';
import { Facility, IFacilityRepository } from '../../../../domain';
import { TransfersModule } from '../../transfers.module';
import { CourtsInfrastructureModule } from '../../../../infrastructure/courts';
import { UpdateStatsCommand } from '../update-stats.command';
import { UpdateStatsHandler } from './update-stats.handler';
import uuid = require('uuid');
import { plainToClass } from 'class-transformer';
import { ClientProxyFactory } from '@nestjs/microservices';

describe('Update Stats Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  const facilityWithSummary: Facility[] = getTestFacSummaries();

  const dbHelper = new TestDbHelper();
  let facilityRepository: IFacilityRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        TransfersModule,
        CourtsInfrastructureModule,
      ],
    }).compile();
    await dbHelper.initConnection();
    await dbHelper.seedDb('facilities', facilityWithSummary);

    const handler = module.get<UpdateStatsHandler>(UpdateStatsHandler);
    facilityRepository = module.get<IFacilityRepository>('IFacilityRepository');
    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(handler, UpdateStatsCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should Update Facility Stats', async () => {
    const stats = [
      { name: 'HtsClientExtract', recieved: 25 },
      { name: 'HtsClientTestsExtract', recieved: 57 },
      { name: 'HtsClientLinkageExtract', recieved: 25 },
      { name: 'HtsTestKitsExtract', recieved: 124 },
      { name: 'HtsClientTracingExtract', recieved: 13 },
      { name: 'HtsPartnerTracingExtract', recieved: 1 },
      { name: 'HtsPartnerNotificationServicesExtract', recieved: 89 },
    ];
    const command = new UpdateStatsCommand(
      facilityWithSummary[0].code,
      { name: 'HTS' },
      stats,
      new Date(),
    );
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const findresult = await facilityRepository.get(facilityWithSummary[0]._id);
    const facility = plainToClass(Facility, findresult);
    stats.forEach(stat => {
      expect(
        facility.getStats(command.docket.name, stat.name).recieved,
      ).toEqual(stat.recieved);
    });

    facility.summaries.forEach(f => {
      Logger.log(
        `${f.docket.name} - ${f.extract.name} ${f.expected} ${f.recieved}`,
      );
    });
  });
});
