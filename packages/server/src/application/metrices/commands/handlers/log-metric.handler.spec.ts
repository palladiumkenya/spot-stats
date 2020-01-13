import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Controller, Injectable, Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import {
  getMeasures,
  getTestFacilities,
  getTestMeasures,
  getTestMetrices,
} from '../../../../../test/test.data';
import { IFacilityRepository } from '../../../../domain';
import { CourtsInfrastructureModule } from '../../../../infrastructure/courts';
import { LogMetricCommand } from '../log-metric.command';
import { MetricesModule } from '../../metrices.module';
import { IMetricRepository } from '../../../../domain/metrices/metric-repository.interface';
import { LogMetricHandler } from './log-metric.handler';
import { plainToClass } from 'class-transformer';

describe('Log Metric Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  const {
    dockets,
    masterFacilities,
    facilities,
    manifests,
  } = getTestFacilities();
  const { measures } = getMeasures();
  const metrices = getTestMetrices();
  const dbHelper = new TestDbHelper();
  const liveData = facilities[0];
  let facilityRepository: IFacilityRepository;
  let metricRepository: IMetricRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CqrsModule,
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        MetricesModule,
        CourtsInfrastructureModule,
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', dockets);
    // await dbHelper.seedDb('facilities', facilities);
    await dbHelper.seedDb('masterfacilities', masterFacilities);
    const manifestsTosave = manifests.filter(
      x => x.facility === facilities[0]._id,
    );
    manifestsTosave.forEach(m => {
      m.name = liveData.name = masterFacilities[0].name;
      m.code = liveData.code = masterFacilities[0].code;
    });

    await dbHelper.seedDb('facilities', [liveData]);
    await dbHelper.seedDb('manifests', manifestsTosave);
    await dbHelper.seedDb('measures', measures);
    const handler = module.get<LogMetricHandler>(LogMetricHandler);
    facilityRepository = module.get<IFacilityRepository>('IFacilityRepository');
    metricRepository = module.get<IMetricRepository>('IMetricRepository');
    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(handler, LogMetricCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should log Fac Metric-New Facility', async () => {
    const command = plainToClass(LogMetricCommand, metrices[0]);
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const facility = await facilityRepository.findByCode(command.facilityCode);
    expect(facility).not.toBeNull();
    const facMetrics = await metricRepository.findByFacilityId(facility._id);
    expect(facMetrics.length).toBeGreaterThan(0);
    facMetrics.forEach(m => Logger.debug(`${m.measure.name}:${m.report}`));
  });

  it('should log Dwapi Metric-New Facility', async () => {
    const command = plainToClass(LogMetricCommand, metrices[1]);
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();

    const facility = await facilityRepository.findByCode(command.facilityCode);
    expect(facility).not.toBeNull();
    const facMetrics = await metricRepository.findByFacilityId(facility._id);
    expect(facMetrics.length).toBeGreaterThan(0);
    facMetrics.forEach(m => Logger.debug(`${m.measure.name}:${m.report}`));
  });
});
