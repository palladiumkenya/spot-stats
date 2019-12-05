import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  Facility,
  IDocketRepository,
  IFacilityRepository,
  IMasterFacilityRepository,
} from '../../../../domain';
import * as uuid from 'uuid';
import { plainToClass } from 'class-transformer';
import { IMetricRepository } from '../../../../domain/metrices/metric-repository.interface';
import { LogMetricCommand } from '../log-metric.command';
import { MetricLoggedEvent } from '../../events/metric-logged.event';
import { Metric } from '../../../../domain/metrices/metric';

export class LogMetricHandler implements ICommandHandler<LogMetricCommand> {
  constructor(
    @Inject('IMasterFacilityRepository')
    private readonly masterFacilityRepository: IMasterFacilityRepository,
    @Inject('IDocketRepository')
    private readonly docketRepository: IDocketRepository,
    @Inject('IFacilityRepository')
    private readonly facilityRepository: IFacilityRepository,
    @Inject('IMetricRepository')
    private readonly metricRepository: IMetricRepository,
    private readonly publisher: EventPublisher,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: LogMetricCommand): Promise<any> {
    // check if metric Exists
    const metricExists = await this.metricRepository.get(command.id);
    if (metricExists) {
      return;
    }

    // check or enroll Facility
    const facility = await this.enrollFacility(command);

    const newMetric = this.createMetric(command);
    if (facility) {
      newMetric.facility(facility._id);
      facility.addMetric(newMetric._id);
    }

    // log metric
    const metric = await this.metricRepository.create(newMetric);
    await this.metricRepository.updateCurrent(newMetric.code);
    this.publisher.mergeObjectContext(newMetric).commit();

    const enrolledFacility = await this.facilityRepository.update(facility);
    this.publisher.mergeObjectContext(facility).commit();

    Logger.log(`Metric processed ${facility.name}`);

    this.eventBus.publish(new MetricLoggedEvent(facility._id, metric._id));

    return newMetric;
  }

  async enrollFacility(command: LogMetricCommand): Promise<Facility> {
    const facility = await this.facilityRepository.findByCode(
      command.facilityCode,
    );

    if (facility) {
      return plainToClass(Facility, facility);
    }

    const newFacility = new Facility(
      uuid.v1(),
      command.facilityCode,
      command.facilityName,
    );
    const masterFacility = await this.masterFacilityRepository.findByCode(
      command.facilityCode,
    );

    if (masterFacility) {
      newFacility.masterFacility = masterFacility;
    }
    const enrolledFacility = await this.facilityRepository.create(newFacility);
    this.publisher.mergeObjectContext(newFacility).commit();
    return newFacility;
  }

  createMetric(command: LogMetricCommand): Metric {
    const metric = new Metric(
      command.id,
      command.facilityCode,
      command.facilityName,
      command.area,
      command.logDate,
      command.logReport,
    );
    return metric;
  }
}
